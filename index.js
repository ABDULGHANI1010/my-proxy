const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Helper function to get ALL pages
async function fetchAllPages(url) {
  let results = [];
  let cursor = null;

  do {
    const fullUrl = cursor ? `${url}&cursor=${cursor}` : url;
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

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
