const fs       = require('fs');
const path     = require('path');
const express  = require('express');
const cors     = require('cors');
const bodyParser = require('body-parser');
const sqlite3  = require('sqlite3').verbose();

const app  = express();
const port = 3000;

/* ---------- Ensure db directory exists ---------- */
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

/* ---------- SQLite connection ---------- */
const dbPath = path.join(dbDir, 'survey.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

/* ---------- Create table if it doesn’t exist ---------- */
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

/* ---------- Middleware ---------- */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

/* ---------- Routes ---------- */

/* Save survey */
app.post('/submit-survey', (req, res) => {
  const { name, email, age, dob, contact, food,
          eatOut, watchMovies, watchTV, listenRadio } = req.body;

  const foodSelection = Array.isArray(food) ? food.join(', ') : food;

  const sql = `
    INSERT INTO surveys
      (name, email, age, dob, contact, food,
       watchMovies, listenRadio, eatOut, watchTV)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      name, email, age, dob, contact, foodSelection,
      watchMovies, listenRadio, eatOut, watchTV
    ],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Failed to save survey.');
      } else {
        res.status(200).send('Survey saved successfully.');
      }
    }
  );
});

/* Get all survey rows (used by results.js) */
app.get('/results', (req, res) => {
  db.all(`SELECT * FROM surveys`, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Database error');
    } else {
      res.json(rows);
    }
  });
});

/* ---------- Start server ---------- */
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

