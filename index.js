const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/games/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const response = await fetch(
      `https://games.roblox.com/v2/users/${userId}/games?accessFilter=2&limit=50`
    );

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});