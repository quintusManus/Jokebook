/**
 * Name: Benjamin Woods
 * Date: 04.14.2025
 * CSC 372-01
 *
 * This file defines the JokeModel for interacting with the categories
 * and jokes tables in the jokebook database. It includes an "external jokes"
 * fallback that fetches from https://v2.jokeapi.dev/ if category not found locally.
 */

const db = require('../db/database');
const fetch = require('node-fetch');

/**
 * getCategories
 * Returns all category names from the categories table
 */
function getCategories() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT name FROM categories ORDER BY name`;
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else {
        const catNames = rows.map((r) => r.name);
        resolve(catNames);
      }
    });
  });
}

/**
 * getJokesByCategory
 * Returns jokes for a given category (with optional limit).
 * If category not in DB, tries external fallback.
 */
async function getJokesByCategory(category, limit) {
  // 1) look for category in local DB
  const catRow = await findCategory(category);
  if (!catRow) {
    // 2) fetch external jokes from JokeAPI
    const jokesFetched = await fetchExternalJokes(category);
    if (jokesFetched.length === 0) {
      // no jokes found externally
      return null;
    }
    // create new category row
    const newCatId = await createCategory(category);
    // bulk insert jokes
    await insertJokesBulk(jokesFetched, newCatId);
    // now fetch them from local
    return getJokesLocal(newCatId, limit);
  } else {
    // fetch local jokes
    return getJokesLocal(catRow.id, limit);
  }
}

/**
 * getRandomJoke
 * Returns a single random joke from the jokes table.
 */
function getRandomJoke() {
  return new Promise((resolve, reject) => {
    const sqlCount = `SELECT COUNT(*) as count FROM jokes`;
    db.get(sqlCount, [], (err, row) => {
      if (err) return reject(err);
      if (row.count === 0) return resolve(null);

      const offset = Math.floor(Math.random() * row.count);
      const sqlRandom = `SELECT setup, delivery FROM jokes LIMIT 1 OFFSET ?`;
      db.get(sqlRandom, [offset], (err2, jokeRow) => {
        if (err2) return reject(err2);
        resolve(jokeRow);
      });
    });
  });
}

/**
 * addJoke
 * Creates the category if needed, then inserts the joke.
 * Returns updated jokes from that category.
 */
function addJoke(category, setup, delivery) {
  return new Promise(async (resolve, reject) => {
    try {
      let catRow = await findCategory(category);
      let catId;
      if (!catRow) {
        catId = await createCategory(category);
      } else {
        catId = catRow.id;
      }
      // insert the new joke
      const sqlInsJoke = `
        INSERT INTO jokes (setup, delivery, category_id)
        VALUES (?, ?, ?)
      `;
      db.run(sqlInsJoke, [setup, delivery, catId], function (err) {
        if (err) return reject(err);

        // fetch updated jokes from local
        getJokesLocal(catId, null)
          .then((updatedJokes) => resolve(updatedJokes))
          .catch((err2) => reject(err2));
      });
    } catch (err) {
      reject(err);
    }
  });
}

/* ---------------------- Helper Functions ----------------------- */

/**
 * findCategory
 * Returns { id } or undefined if not found
 */
function findCategory(catName) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM categories WHERE name = ?`;
    db.get(sql, [catName], (err, row) => {
      if (err) return reject(err);
      resolve(row); // row or undefined
    });
  });
}

/**
 * createCategory
 * Creates a new category row, returns the new category ID
 */
function createCategory(catName) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO categories (name) VALUES (?)`;
    db.run(sql, [catName], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

/**
 * getJokesLocal
 * Return jokes by category_id, optional limit
 */
function getJokesLocal(categoryId, limit) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT setup, delivery FROM jokes WHERE category_id = ? ORDER BY id DESC`;
    const params = [categoryId];
    if (limit && Number(limit) > 0) {
      sql += ` LIMIT ${Number(limit)}`;
    }
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * insertJokesBulk
 * Insert multiple jokes {setup, delivery} under given category ID
 */
function insertJokesBulk(jokeArray, catId) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO jokes (setup, delivery, category_id) VALUES (?, ?, ?)`;
    const stmt = db.prepare(sql);
    try {
      jokeArray.forEach((j) => {
        stmt.run([j.setup, j.delivery, catId]);
      });
      stmt.finalize();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * fetchExternalJokes
 * Instead of using userCategory as the path, we use `Any?contains=userCategory`
 * and attempt up to 3 two-part jokes in safe-mode.
 */
async function fetchExternalJokes(catName) {
  // remove punctuation, spaces, etc. from catName to form a search query
  const searchTerm = catName.replace(/[^\w\s]/gi, '').trim();
  if (!searchTerm) {
    return [];
  }

  // e.g. https://v2.jokeapi.dev/joke/Any?type=twopart&amount=3&safe-mode&contains=knockknock
  const url = `https://v2.jokeapi.dev/joke/Any?type=twopart&amount=3&safe-mode&contains=${encodeURIComponent(searchTerm)}`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      return [];
    }
    const data = await resp.json();
    if (data.error === true) {
      // no jokes or invalid param
      return [];
    }
    // data can be { jokes: [ ... ] } or a single { type: "twopart" }
    const jokes = [];
    if (Array.isArray(data.jokes)) {
      data.jokes.forEach((j) => {
        jokes.push({ setup: j.setup, delivery: j.delivery });
      });
    } else if (data.type === 'twopart') {
      // single
      jokes.push({ setup: data.setup, delivery: data.delivery });
    }
    return jokes;
  } catch (err) {
    console.error('Error fetching external jokes:', err);
    return [];
  }
}

module.exports = {
  getCategories,
  getJokesByCategory,
  getRandomJoke,
  addJoke
};