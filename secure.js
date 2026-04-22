const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

function searchProductSafe(name) {
    // Validation: At least 2 characters, no < > or ;
    if (typeof name !== 'string' || name.length < 2) {
        console.log(`Validation Error: "${name}" is too short.`);
        return [];
    }
    if (/[<>;]/.test(name)) {
        console.log(`Validation Error: "${name}" contains forbidden characters.`);
        return [];
    }

    const sql = "SELECT * FROM products WHERE name LIKE ?";
    return db.prepare(sql).all(`%${name}%`);
}

function loginSafe(username, password) {
    // Validation: No spaces, not empty
    if (typeof username !== 'string' || username.trim().length === 0 || /\s/.test(username)) {
        console.log(`Validation Error: Username "${username}" is invalid (empty or contains spaces).`);
        return undefined;
    }
    // Validation: Password at least 6 characters
    if (typeof password !== 'string' || password.length < 6) {
        console.log(`Validation Error: Password for "${username}" is too short.`);
        return undefined;
    }

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    return db.prepare(sql).get(username, password);
}

// --- TEST CASES ---
console.log('Test 1 (Valid):', searchProductSafe('cement'));
console.log('Test 2 (Empty):', searchProductSafe(''));
console.log('Test 3 (Script):', searchProductSafe('<script>'));
console.log('Test 4 (Login Valid):', loginSafe('admin', 'admin123'));
console.log('Test 5 (Pass Short):', loginSafe('admin', 'ab'));
console.log('Test 6 (User Space):', loginSafe('ad min', 'pass123'));

db.close();