const express = require('express');
const cors = require('cors');
const { parse } = require('csv-parse/sync');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Cache setup
let menuCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 60000; // 1 minute in milliseconds

// Helper to convert CSV string to JSON
const parseCSV = (csvData) => {
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
  });

  return records.map(record => ({
    id: parseInt(record.id) || Date.now() + Math.random(),
    category: record.category ? record.category.trim() : 'Uncategorized',
    name: record.name ? record.name.trim() : 'Unknown Item',
    items: (record.items || record.Items || '').trim(),
    price: parseFloat(record.price || record.Price) || 0,
    image: (record.image || record.Image || '').trim(),
    available: (record.available || record.Available || '').toLowerCase() === 'true'
  }));
};

app.get('/api/menu', async (req, res) => {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    // Check if we need to mock data when no sheet is provided
    if (!sheetId) {
      console.warn("No GOOGLE_SHEET_ID provided, returning mock data.");
      return res.json([
        {
          "id": 126,
          "category": "Combo",
          "name": "Chinese Combo",
          "items": "Fried Rice / Noodles + Manchurian",
          "price": 200,
          "image": "",
          "available": true
        },
        {
          "id": 127,
          "category": "Snacks",
          "name": "Veg Cheese Maggie",
          "items": "",
          "price": 100,
          "image": "",
          "available": true
        },
        {
          "id": 128,
          "category": "Drinks",
          "name": "Cold Coffee",
          "items": "",
          "price": 120,
          "image": "",
          "available": true
        }
      ]);
    }

    const currentTime = Date.now();
    
    // Return cache if valid
    if (menuCache && lastFetchTime && (currentTime - lastFetchTime < CACHE_DURATION)) {
      console.log('Serving from cache');
      return res.json(menuCache.filter(item => item.available));
    }

    console.log('Fetching from Google Sheets');
    // Fetching the public CSV
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    const response = await axios.get(url);
    
    const parsedData = parseCSV(response.data);
    
    // Update cache
    menuCache = parsedData;
    lastFetchTime = Date.now();

    // Filter available
    const availableItems = parsedData.filter(item => item.available);
    
    res.json(availableItems);
  } catch (error) {
    console.error("Error fetching menu:", error.message);
    res.status(500).json({ error: "Failed to fetch menu data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
