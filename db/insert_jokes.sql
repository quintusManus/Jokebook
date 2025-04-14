/*
  Name: Benjamin Woods
  Date: 04.14.2025
  CSC 372-01

  This file populates the database with the sample jokes from the prompt:
  categories = ['funnyJoke', 'lameJoke'], plus their jokes.
*/

/* Insert categories */
INSERT INTO categories (name) VALUES ('funnyJoke');
INSERT INTO categories (name) VALUES ('lameJoke');

/* Insert jokes for funnyJoke: */

INSERT INTO jokes (setup, delivery, category_id)
VALUES (
  'Why did the student eat his homework?',
  'Because the teacher told him it was a piece of cake!',
  (SELECT id FROM categories WHERE name='funnyJoke')
);

INSERT INTO jokes (setup, delivery, category_id)
VALUES (
  'What kind of tree fits in your hand?',
  'A palm tree',
  (SELECT id FROM categories WHERE name='funnyJoke')
);

INSERT INTO jokes (setup, delivery, category_id)
VALUES (
  'What is worse than raining cats and dogs?',
  'Hailing taxis',
  (SELECT id FROM categories WHERE name='funnyJoke')
);

/* Insert jokes for lameJoke: */

INSERT INTO jokes (setup, delivery, category_id)
VALUES (
  'Which bear is the most condescending?',
  'Pan-DUH',
  (SELECT id FROM categories WHERE name='lameJoke')
);

INSERT INTO jokes (setup, delivery, category_id)
VALUES (
  'What would the Terminator be called in his retirement?',
  'The Exterminator',
  (SELECT id FROM categories WHERE name='lameJoke')
);