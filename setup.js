// setup.js - run: npm install better-sqlite3 then node setup.js
const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');
db.exec(`
CREATE TABLE IF NOT EXISTS products (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
description TEXT,
price REAL NOT NULL
)
`);
const insert = db.prepare('INSERT INTO products (name, description, price) VALUES (?, ?, ?)');
const insertAll = db.transaction((rows) => { for (const r of rows) insert.run(...r); });
insertAll([
['Cement (bag)', 'Portland cement 50kg bag', 35000],
['Iron Sheet 3m','Gauge 30 roofing sheet 3m long', 110000],

['Paint 5L', 'Exterior wall paint white 5L', 60000],
['Nails 1kg', 'Common wire nails 1kg pack', 12000],
['Timber 2x4', 'Pine timber plank 2x4 per metre', 25000],
]);
const rows = db.prepare('SELECT * FROM products').all();
console.log(rows);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'attendant'
);
INSERT OR IGNORE INTO users (username, password, role) VALUES
  ('admin', 'admin123', 'admin'),
  ('fatuma', 'pass456', 'attendant'),
  ('wasswa', 'pass789', 'manager');
`);
