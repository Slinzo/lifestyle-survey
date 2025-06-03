const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// SQLite database setup
const db = new sqlite3.Database('./db/survey.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

//creates the table if it doesn't exist already
db.run(`
  CREATE TABLE IF NOT EXISTS surveys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    dob TEXT,
    age INTEGER,
    contact TEXT,
    food TEXT,
    watchMovies INTEGER,
    listenRadio INTEGER,
    eatOut INTEGER,
    watchTV INTEGER
  )
`, (err) => {
  if (err) {
    console.error('Error creating surveys table:', err.message);
  } else {
    console.log('Surveys table ensured.');
  }
});


// Route: Save survey
app.post('/submit-survey', (req, res) => {
  const { name, email, age, dob, contact, food, eatOut, watchMovies, watchTV, listenRadio } = req.body;

  const foodSelection = Array.isArray(food) ? food.join(', ') : food;

  const sql = `
  INSERT INTO surveys (name, email, age, dob, contact, food, watchMovies, listenRadio, eatOut, watchTV)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  db.run(sql, [name, email, age, dob, contact, foodSelection, eatOut, watchMovies, watchTV, listenRadio], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Failed to save survey.');
    } else {
      res.status(200).send('Survey saved successfully.');
    }
  });
});

// Route: Get survey results
app.get('/results', (req, res) => {
  db.all(`SELECT * FROM surveys`, (err, rows) => {
    if (err) {
      res.status(500).send("Database error");
    } else {
      res.json(rows);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

