/**
 * Name: Benjamin Woods
 * Date: 04.14.2025
 * CSC 372-01
 *
 * This file provides a singleton SQLite database connection.
 * It connects to the SQLite database file 'jokebook.db' located in the same directory.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'jokebook.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to jokebook.db:', err);
  } else {
    console.log('Connected to SQLite DB:', dbPath);
  }
});

module.exports = db;