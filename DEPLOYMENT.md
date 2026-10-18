# 🚀 Deploying WishGlow to Render and Supabase

This guide walks you through deploying **WishGlow** online with **Render** (free web hosting) and **Supabase** (free PostgreSQL database and media storage).

---

## Part 1: Setting Up Supabase Database (2 Minutes)

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Once your project is ready, navigate to the **SQL Editor** on the left menu.
3. Open [`supabase/schema.sql`](file:///C:/Users/Admin/.gemini/antigravity/scratch/wishglow/supabase/schema.sql) from this repository, copy its contents, and click **Run**.
   - This creates the `wishes`, `reactions`, and `payments` tables with Row Level Security (RLS).
4. Go to **Project Settings** → **API**.
5. Copy your **Project URL** and **anon / public** API Key.

---

## Part 2: Deploying to Render (3 Minutes)

1. Push this project code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of WishGlow"
   git remote add origin https://github.com/your-username/wishglow.git
   git push -u origin main
   ```
2. Go to [render.com](https://render.com) and sign in.
3. Click **New +** → **Web Service**.
4. Connect your GitHub repository.
5. Configure the service:
   - **Name**: `wishglow`
   - **Environment**: `Node`
   - **Region**: Any (e.g. Frankfurt or Oregon)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Plan**: Free
6. Under **Advanced / Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `VITE_SUPABASE_URL`: (Paste your Supabase URL)
   - `VITE_SUPABASE_ANON_KEY`: (Paste your Supabase Anon Key)
7. Click **Create Web Service**. Render will automatically build the React frontend, start the Express backend, and provide you with a live `https://wishglow.onrender.com` URL!

---

## Part 3: Testing Without External Services

WishGlow is built with **zero external hard dependencies**:
- If Supabase environment variables are omitted, WishGlow automatically uses its built-in JSON file store and URL state encoding.
- The payment system comes with instant test promo codes (`WISH48`, `MAGICFREE`) so users can test the entire checkout and link generation workflow without real money!
