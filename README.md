# Whereabout Cafe - Digital Menu & Ordering System

A modern, mobile-first digital restaurant menu built with React, Tailwind CSS, and a Node.js/Express backend that fetches menu data directly from a Google Sheet. It includes a built-in shopping cart and a WhatsApp ordering integration.

## 📁 Project Structure

- `/backend` - Node.js Express API that fetches and caches Google Sheets data.
- `/frontend` - React + Vite + Tailwind CSS frontend application.

## 🚀 Getting Started Locally

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on port 5000):
   ```bash
   node server.js
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 📊 Connecting Your Google Sheet

The backend uses a simple public CSV export approach to fetch data without needing complex Google Cloud Service Accounts.

1. **Create your Google Sheet** with the following exact column headers (case-sensitive):
   `id` | `category` | `name` | `items` | `price` | `image` | `available`
2. **Add your menu data**:
   - `id`: A unique number (e.g., 1, 2, 3)
   - `category`: Category name (e.g., Snacks, Combos, Drinks)
   - `name`: Name of the dish
   - `items`: Subtext (used for combos, e.g., "Burger + Fries")
   - `price`: Number without currency symbol (e.g., 150)
   - `available`: `true` or `false`
3. **Publish the Sheet**:
   - Go to `File` > `Share` > `Publish to web`.
   - Select the specific sheet tab (e.g., "Sheet1") instead of "Entire Document".
   - Select **Comma-separated values (.csv)** from the dropdown.
   - Click **Publish**.
4. **Get the Sheet ID**:
   - From your standard Google Sheet URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
   - Copy the `YOUR_SHEET_ID_HERE` part.
5. **Configure Backend**:
   - Create a `.env` file in the `backend/` directory.
   - Add: `GOOGLE_SHEET_ID=your_sheet_id_here`

---

## 🌍 Deployment Instructions

### Deploying the Backend (Render.com)
1. Push your code to GitHub.
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your repository.
4. Set the **Root Directory** to `backend`.
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Add Environment Variable: `GOOGLE_SHEET_ID` = your sheet ID.
8. Deploy! Render will give you a backend URL (e.g., `https://my-backend.onrender.com`).

### Deploying the Frontend (Vercel)
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your repository.
4. Set the **Root Directory** to `frontend`.
5. Vercel will auto-detect Vite. Build settings will auto-populate (`npm run build`).
6. **IMPORTANT**: Before deploying, update `App.jsx` in the frontend to point to your live Render backend URL instead of `http://localhost:5000/api/menu`.
   - *Tip: You can use `import.meta.env.VITE_API_URL` to handle local vs production URLs dynamically.*
7. Click **Deploy**.

## 📞 Changing the WhatsApp Number
To change the WhatsApp number that receives the orders:
1. Open `frontend/src/components/CartDrawer.jsx`.
2. Locate line `5`: `const WHATSAPP_NUMBER = '918619011024';`
3. Change it to your new number (include country code without + or 00).
