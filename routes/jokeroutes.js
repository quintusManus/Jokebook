/**
 * Name: Benjamin Woods
 * Date: 04.14.2025
 * CSC 372-01
 *
 * This file defines the Express routes for the jokebook endpoints.
 */

const express = require('express');
const router = express.Router();
const jokeController = require('../controllers/jokecontroller');

// i. GET /jokebook/categories
router.get('/categories', jokeController.getCategories);

// ii. GET /jokebook/joke/:category?limit=...
router.get('/joke/:category', jokeController.getJokesByCategory);

// iii. GET /jokebook/random
router.get('/random', jokeController.getRandomJoke);

// iv. POST /jokebook/joke/add
router.post('/joke/add', jokeController.addNewJoke);

module.exports = router;