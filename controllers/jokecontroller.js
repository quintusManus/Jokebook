/**
 * Name: Benjamin Woods
 * Date: 04.14.2025
 * CSC 372-01
 *
 * This file defines the controller logic for the jokebook endpoints:
 * categories, jokes, random, and adding new jokes.
 * We also handle the fallback if category not found, from the model.
 */

const JokeModel = require('../models/jokemodel');

async function getCategories(req, res) {
  try {
    const categories = await JokeModel.getCategories();
    res.json(categories);
  } catch (err) {
    console.error('Error in getCategories:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getJokesByCategory(req, res) {
  try {
    const { category } = req.params;
    const { limit } = req.query; // optional
    const jokes = await JokeModel.getJokesByCategory(category, limit);
    if (jokes === null || jokes.length === 0) {
      return res.status(404).json({ error: `No jokes found for '${category}'.` });
    }
    res.json(jokes);
  } catch (err) {
    console.error('Error in getJokesByCategory:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getRandomJoke(req, res) {
  try {
    const joke = await JokeModel.getRandomJoke();
    if (!joke) {
      return res.status(404).json({ error: 'No jokes in the database yet.' });
    }
    res.json(joke);
  } catch (err) {
    console.error('Error in getRandomJoke:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function addNewJoke(req, res) {
  try {
    const { category, setup, delivery } = req.body;
    if (!category || !setup || !delivery) {
      return res.status(400).json({ error: 'Missing category, setup, or delivery.' });
    }
    const updatedJokes = await JokeModel.addJoke(category, setup, delivery);
    res.json(updatedJokes); // the updated jokes in that category
  } catch (err) {
    console.error('Error in addNewJoke:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getCategories,
  getJokesByCategory,
  getRandomJoke,
  addNewJoke
};