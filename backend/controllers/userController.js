const {
  findOrCreateUser,
  getUserById,
  updateUserTokens
} = require('../models/userModel');

async function handleFindOrCreateUser(req, res) {
  try {
    const user = await findOrCreateUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function handleGetUserById(req, res) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function handleUpdateUserTokens(req, res) {
  try {
    await updateUserTokens(req.params.id, req.body.accessToken, req.body.refreshToken);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  handleFindOrCreateUser,
  handleGetUserById,
  handleUpdateUserTokens
};
