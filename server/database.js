const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    const dbPath = path.join(__dirname, 'criticus.db');
    this.db = new sqlite3.Database(dbPath);

    this.db.serialize(() => {
      // Create waitlist table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS waitlist_signups (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          university TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('student', 'professor', 'administrator')),
          how_heard_about_us TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create demo requests table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS demo_requests (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          institution_type TEXT NOT NULL CHECK (institution_type IN ('high-school', 'community-college', 'university')),
          institution_name TEXT NOT NULL,
          role TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    });

    console.log('📚 Database initialized and ready');
  }

  createWaitlistSignup(data) {
    return new Promise((resolve, reject) => {
      const { id, name, email, university, role, howHeardAboutUs } = data;

      this.db.run(
        `INSERT INTO waitlist_signups (id, name, email, university, role, how_heard_about_us)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, name, email, university, role, howHeardAboutUs],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  createDemoRequest(data) {
    return new Promise((resolve, reject) => {
      const { id, name, email, institutionType, institutionName, role } = data;

      this.db.run(
        `INSERT INTO demo_requests (id, name, email, institution_type, institution_name, role)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, name, email, institutionType, institutionName, role],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  getWaitlistSignups() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM waitlist_signups ORDER BY created_at DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  getDemoRequests() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM demo_requests ORDER BY created_at DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Database;