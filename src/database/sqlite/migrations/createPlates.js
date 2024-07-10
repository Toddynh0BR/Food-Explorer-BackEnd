const createPlates = `
CREATE TABLE IF NOT EXISTS plates (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   img VARCHAR,
   name VARCHAR,
   price VARCHAR,
   description TEXT,
   category VARCHAR,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

module.exports = createPlates;