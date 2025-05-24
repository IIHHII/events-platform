const db = require('../db'); // adjust to your DB setup

async function findOrCreateUser({ googleId, email, name, accessToken, refreshToken }) {
  const res = await db.query('SELECT * FROM users WHERE google_id=$1', [googleId]);

  if (res.rows.length > 0) {
    return res.rows[0]; // user already exists
  }

  const insert = await db.query(
    `INSERT INTO users (google_id, email, name, access_token, refresh_token)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [googleId, email, name, accessToken, refreshToken]
  );
  return insert.rows[0];
}

async function getUserById(id) {
  const res = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return res.rows[0];
}

module.exports = { findOrCreateUser, getUserById };
