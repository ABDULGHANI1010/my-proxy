const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Helper function to get ALL pages of data
async function fetchAllPages(url, cursorParam = 'cursor') {
  let results = [];
  let cursor = null;

  do {
    const fullUrl = cursor ? `${url}&${cursorParam}=${cursor}` : url;
    const response = await fetch(fullUrl);
    const data = await response.json();

    if (data.data) results = results.concat(data.data);
    cursor = data.nextPageCursor || null;

  } while (cursor);

  return results;
}

// Get ALL limiteds/collectibles
app.get('/limiteds/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await fetchAllPages(
      `https://inventory.roblox.com/v1/users/${userId}/assets/collectibles?limit=100`
    );
    res.json({ data: results, total: results.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ALL owned gamepasses
// Get ALL owned gamepasses
app.get('/gamepasses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let results = [];
    let pageToken = null;

    do {
      const url = `https://apis.roblox.com/game-passes/v1/users/${userId}/game-passes?count=100${pageToken ? `&pageToken=${pageToken}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      console.log('Response:', JSON.stringify(data));

      if (data.gamePassItems) results = results.concat(data.gamePassItems);
      if (data.data) results = results.concat(data.data);

      pageToken = data.nextPageToken || null;

    } while (pageToken);

    res.json({ data: results, total: results.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});

