const db = require('../db');

async function findOrCreateUser({ googleId, email, name, accessToken, refreshToken }) {
  const { rows } = await db.query('SELECT * FROM users WHERE google_id=$1', [googleId]);
  if (rows.length) {
    await db.query(
      'UPDATE users SET access_token=$1, refresh_token=$2 WHERE google_id=$3',
      [accessToken, refreshToken, googleId]
    );
    return (await db.query('SELECT * FROM users WHERE google_id=$1', [googleId])).rows[0];
  }
  const res = await db
    .query(
      `INSERT INTO users
         (google_id,email,name,access_token,refresh_token,role)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [googleId, email, name, accessToken, refreshToken, 'user']
    );
  return res.rows[0];
}

async function getUserById(id) {
  const { rows } = await db.query('SELECT * FROM users WHERE id=$1', [id]);
  return rows[0];
}

async function updateUserTokens(userId, accessToken, refreshToken) {
  await db.query(
    'UPDATE users SET access_token=$1, refresh_token=$2 WHERE id=$3',
    [accessToken, refreshToken, userId]
  );
}

module.exports = { findOrCreateUser, getUserById, updateUserTokens };
