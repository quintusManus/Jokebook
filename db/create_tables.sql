/*
  Name: Benjamin Woods
  Date: 04.14.2025
  CSC 372-01

  This file creates the schema for the jokebook database.
*/

-- Table for categories
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- Table for jokes
CREATE TABLE IF NOT EXISTS jokes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setup TEXT NOT NULL,
  delivery TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories (id)
);