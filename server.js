const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database('./database/university.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// GET /api/courses - get all courses
app.get('/api/courses', (req, res) => {
  db.all('SELECT * FROM Courses', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/courses/:id - get course by ID
app.get('/api/courses/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM Courses WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Course not found' });
    res.json(row);
  });
});

// POST /api/courses - create new course
app.post('/api/courses', (req, res) => {
  const { courseCode, title, credits, description, semester } = req.body;
  const sql = `INSERT INTO Courses (courseCode, title, credits, description, semester) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [courseCode, title, credits, description, semester], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, courseCode, title, credits, description, semester });
  });
});

// PUT /api/courses/:id - update course by ID
app.put('/api/courses/:id', (req, res) => {
  const { id } = req.params;
  const { courseCode, title, credits, description, semester } = req.body;
  const sql = `
    UPDATE Courses
    SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ?
    WHERE id = ?
  `;
  db.run(sql, [courseCode, title, credits, description, semester, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Course not found' });
    res.json({ id, courseCode, title, credits, description, semester });
  });
});

// DELETE /api/courses/:id - delete course by ID
app.delete('/api/courses/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM Courses WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted successfully', id });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
