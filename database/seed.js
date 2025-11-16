const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./database/university.db', (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
    return;
  }
  console.log('Connected to SQLite database');

  // Create the Courses table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS Courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseCode TEXT,
      title TEXT,
      credits INTEGER,
      description TEXT,
      semester TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating Courses table:', err.message);
      return;
    }
    console.log('Courses table ready');

    // Array of courses to insert
    const courses = [
      ['CS101', 'Intro Programming', 3, 'Learn Python basics', 'Fall 2024'],
      ['BIO120', 'General Biology', 3, 'Introduction to biological principles', 'Fall 2024'],
      ['MATH150', 'Calculus I', 4, 'Basic calculus', 'Fall 2024'],
      ['ENG101', 'Composition I', 3, 'Academic writing and critical thinking', 'Spring 2025'],
      ['ME210', 'Thermodynamics', 3, 'Principles of thermodynamics and heat transfer', 'Spring 2025'],
      ['CS301', 'Database Systems', 3, 'Design and implementation of database systems', 'Fall 2024'],
      ['PHYS201', 'Physics II', 4, 'Electricity, magnetism, and modern physics', 'Spring 2025'],
      ['CS201', 'Data Structures', 4, 'Study of fundamental data structures and algorithms', 'Spring 2025']
    ];

    // Prepare insert statement
    const stmt = db.prepare(`INSERT INTO Courses (courseCode, title, credits, description, semester) VALUES (?, ?, ?, ?, ?)`);

    // Insert all courses
    for (const course of courses) {
      stmt.run(course, (err) => {
        if (err) console.error('Error inserting course:', err.message);
      });
    }

    // Finalize statement and close DB
    stmt.finalize((err) => {
      if (err) console.error('Error finalizing statement:', err.message);

      db.close((err) => {
        if (err) {
          console.error('Error closing the database:', err.message);
        } else {
          console.log('All courses inserted and database connection closed');
        }
      });
    });
  });
});
