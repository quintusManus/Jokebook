/**
 * Name: Benjamin Woods
 * Date: 04.14.2025
 * CSC 372-01
 *
 * This is the main entry point for the Node/Express jokebook server.
 * It serves static files from /public and mounts the jokebook routes at /jokebook.
 */

const express = require('express');
const path = require('path');
const jokeRoutes = require('./routes/jokeroutes');

const PORT = process.env.PORT || 3000;
const app = express();

// parse JSON request bodies
app.use(express.json());

// serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// mount the jokebook routes at /jokebook
app.use('/jokebook', jokeRoutes);

// health check (optional)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date() });
});

// start server
app.listen(PORT, () => {
  console.log(`Jokebook server running at http://localhost:${PORT}`);
});