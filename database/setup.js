const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./database/university.db', (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
    return;
  }
  console.log('Connected to SQLite database');

  // Create the Courses table
  db.run(`
    CREATE TABLE IF NOT EXISTS Courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseCode TEXT,
      title TEXT,
      credits INTEGER,
      description TEXT,
      semester INTEGER
    )
  `, (err) => {
    if (err) {
      console.error('Error creating Courses table:', err.message);
    } else {
      console.log('Courses table created or already exists');
    }

    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing the database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  });
});
