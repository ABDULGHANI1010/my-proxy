// Get ALL owned gamepasses
app.get('/gamepasses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let results = [];
    let pageToken = null;

    do {
      const url = pageToken
        ? `https://apis.roblox.com/game-passes/v1/users/${userId}/game-passes?count=100&pageToken=${pageToken}`
        : `https://apis.roblox.com/game-passes/v1/users/${userId}/game-passes?count=100`;

      const response = await fetch(url);
      const text = await response.text(); // get raw response first
      console.log('Gamepass response:', text); // log it so we can see errors

      const data = JSON.parse(text);
      if (data.gamePassItems) results = results.concat(data.gamePassItems);
      pageToken = data.nextPageToken || null;

    } while (pageToken);

    res.json({ data: results, total: results.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
