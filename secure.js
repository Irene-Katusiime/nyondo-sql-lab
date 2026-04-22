const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

function searchProductSafe(name) {
    // The '?' is a placeholder. We pass the data separately.
    const sql = "SELECT * FROM products WHERE name LIKE ?";
    const stmt = db.prepare(sql);
    
    // We concatenate the wildcards here, not in the SQL string
    const rows = stmt.all(`%${name}%`);
    return rows;
}

function loginSafe(username, password) {
    // The engine treats '?' as literal data, never as code
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    const stmt = db.prepare(sql);
    
    const row = stmt.get(username, password);
    return row;
}

// These must ALL return undefined or [] because the injection is treated as a literal string
console.log('Test 1:', searchProductSafe("' OR 1=1--"));
console.log('Test 2:', searchProductSafe("' UNION SELECT id,username,password,role FROM users--"));
console.log('Test 3:', loginSafe("admin'--", 'anything'));
console.log('Test 4:', loginSafe("' OR '1'='1", "' OR '1'='1"));

db.close();