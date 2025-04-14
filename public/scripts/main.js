/**
 * Name: Benjamin Woods
 * Date: 04.14.2025
 * CSC 372-01
 *
 * This file uses fetch() to call the jokebook endpoints
 * and updates the DOM. If the category doesn't exist locally,
 * the code fetches jokes from the external API automatically.
 */

document.addEventListener('DOMContentLoaded', () => {
    const randomJokeDiv = document.getElementById('random-joke');
    const btnLoadCategories = document.getElementById('btnLoadCategories');
    const categoryList = document.getElementById('category-list');
    const btnSearchCategory = document.getElementById('btnSearchCategory');
    const searchCatInput = document.getElementById('search-category');
    const searchLimitInput = document.getElementById('search-limit');
    const jokeList = document.getElementById('joke-list');
    const newJokeForm = document.getElementById('new-joke-form');
    const addResult = document.getElementById('add-result');
  
    // 1) On page load, fetch a random joke
    fetch('/jokebook/random')
      .then((res) => res.json())
      .then((joke) => {
        if (joke.error) {
          randomJokeDiv.textContent = joke.error;
        } else {
          randomJokeDiv.textContent = `${joke.setup} - ${joke.delivery}`;
        }
      })
      .catch((err) => {
        randomJokeDiv.textContent = `Error fetching random joke: ${err}`;
      });
  
    // 2) Load categories
    btnLoadCategories.addEventListener('click', () => {
      fetch('/jokebook/categories')
        .then((res) => res.json())
        .then((categories) => {
          categoryList.innerHTML = ''; // clear old items
          categories.forEach((cat) => {
            const li = document.createElement('li');
            li.textContent = cat;
            li.addEventListener('click', () => {
              loadJokesByCategory(cat);
            });
            categoryList.appendChild(li);
          });
        })
        .catch((err) => {
          categoryList.textContent = `Error: ${err}`;
        });
    });
  
    // 3) Searching for jokes by category (with optional limit)
    btnSearchCategory.addEventListener('click', () => {
      const cat = searchCatInput.value.trim();
      if (!cat) return;
      const limit = searchLimitInput.value.trim();
      loadJokesByCategory(cat, limit);
    });
  
    function loadJokesByCategory(category, limit) {
      let url = `/jokebook/joke/${category}`;
      if (limit) {
        url += `?limit=${limit}`;
      }
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            jokeList.textContent = data.error;
          } else if (Array.isArray(data)) {
            jokeList.innerHTML = '';
            data.forEach((j) => {
              const li = document.createElement('li');
              li.textContent = `${j.setup} -> ${j.delivery}`;
              jokeList.appendChild(li);
            });
          }
        })
        .catch((err) => {
          jokeList.textContent = `Error fetching jokes: ${err}`;
        });
    }
  
    // 4) Add a new joke
    newJokeForm.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const categoryVal = document.getElementById('category-field').value.trim();
      const setupVal = document.getElementById('setup-field').value.trim();
      const deliveryVal = document.getElementById('delivery-field').value.trim();
  
      if (!categoryVal || !setupVal || !deliveryVal) {
        addResult.textContent = 'All fields are required!';
        return;
      }
  
      fetch('/jokebook/joke/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: categoryVal,
          setup: setupVal,
          delivery: deliveryVal
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            addResult.textContent = data.error;
          } else if (Array.isArray(data)) {
            addResult.textContent = 'Joke added successfully!';
            // show updated jokes
            jokeList.innerHTML = '';
            data.forEach((j) => {
              const li = document.createElement('li');
              li.textContent = `${j.setup} -> ${j.delivery}`;
              jokeList.appendChild(li);
            });
          }
        })
        .catch((err) => {
          addResult.textContent = `Error adding joke: ${err}`;
        });
    });
  });