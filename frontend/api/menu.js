import { parse } from 'csv-parse/sync';
import axios from 'axios';

// Vercel serverless functions maintain memory between warm invocations
let menuCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 60000; // 1 minute

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

export default async function handler(req, res) {
  // CORS configuration for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    if (!sheetId) {
      console.warn("No GOOGLE_SHEET_ID provided, returning mock data.");
      return res.status(200).json([
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
      return res.status(200).json(menuCache.filter(item => item.available));
    }

    console.log('Fetching from Google Sheets');
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    const response = await axios.get(url);
    
    const parsedData = parseCSV(response.data);
    
    // Update cache
    menuCache = parsedData;
    lastFetchTime = Date.now();

    const availableItems = parsedData.filter(item => item.available);
    
    res.status(200).json(availableItems);
  } catch (error) {
    console.error("Error fetching menu:", error.message);
    res.status(500).json({ error: "Failed to fetch menu data" });
  }
};
