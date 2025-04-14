# Jokebook (Extra Credit: Contains Search)

## Overview
This is a Node/Express + SQLite web application for managing a "Jokebook" database of jokes.  
It supports:
1. A **local** database of categories and jokes (funnyJoke, lameJoke, etc.).
2. **Extra credit** fallback: If the user searches a category not in the local DB, the app fetches **up to 3 two-part jokes** from [JokeAPI](https://v2.jokeapi.dev/), using a "contains" parameter. 
   - For example, the the user searches `"Any"`.
   - If found, these jokes are inserted locally under the exact category name typed by the user.

## Features

- **GET** `/<public>/index.html` – A landing page that shows:
  - A **random** local joke.
  - A button to **load categories** from the DB.
  - A **search** field to request jokes in a category (local or external).
  - A form to **add** a new joke to the DB.
- **API** endpoints under `/jokebook/`:
  - `GET /jokebook/categories` – Returns local category names (e.g. `[ "funnyJoke","lameJoke"]`).
  - `GET /jokebook/joke/:category?limit=?` – Returns jokes in local DB if category is found. If not found, tries external JokeAPI (safe mode) searching "contains=..." for that category. If found, inserts them locally and returns them. 
  - `GET /jokebook/random` – Returns one random local joke.
  - `POST /jokebook/joke/add` – Adds a new joke to the local DB under the specified category (creating that category if needed).

## Installation

1. **Clone** this repository or copy the files into a folder (e.g. `jokebook`).
2. In that folder, run:
   ```bash
   npm install

This installs dependencies (express, sqlite3, node-fetch@2).

Database Setup
	1.	Create or reset the SQLite database:

sqlite3 db/jokebook.db < db/drop_tables.sql
sqlite3 db/jokebook.db < db/create_tables.sql
sqlite3 db/jokebook.db < db/insert_jokes.sql

The insert_jokes.sql script populates categories “funnyJoke” and “lameJoke” with the example jokes from the assignment.

	2.	Check your tables:

sqlite3 db/jokebook.db
sqlite> .tables
sqlite> SELECT * FROM categories;
sqlite> SELECT * FROM jokes;



Running the App
	1.	Start the Express server:

npm start


	2.	Open http://localhost:3000/ in your browser:
	•	A random joke from your DB is displayed at the top.
	•	Click Load Categories to see the local categories (funnyJoke, lameJoke by default).
	•	Searching for “Any” triggers an external fetch to Any?contains=Any. If no external jokes match, you get an error. If found, they are inserted locally under "Any".
	•	Use Add a New Joke form to add custom jokes to any category.

Testing Endpoints (Thunder Client / Postman)
	•	GET http://localhost:3000/jokebook/categories
	•	GET http://localhost:3000/jokebook/joke/funnyJoke
	•	GET http://localhost:3000/jokebook/random
	•	POST http://localhost:3000/jokebook/joke/add
Example JSON body:

{
  "category": "disneyJoke",
  "setup": "Did you get to go to Disney?",
  "delivery": "I'm sure you will once you wish upon a star"
}



Extra Notes
	•	The code uses Any?contains=<searchTerm> with type=twopart, amount=3, and safe-mode.
	•	If you want more single-part jokes, remove type=twopart.
	•	If the external API returns 0 jokes, you’ll see "No jokes found for '<category>'.".

