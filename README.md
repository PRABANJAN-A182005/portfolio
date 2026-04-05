# MERN Portfolio

A responsive portfolio starter built with the MERN stack:

- `client`: React + Vite frontend
- `server`: Express + MongoDB API

The app is designed to work even before MongoDB is connected. In that mode, the backend serves starter portfolio content from a seed file so the UI can still be previewed immediately.

## Features

- Responsive landing page with hero, about, skills, projects, experience, and contact sections
- Theme toggle with saved preference
- Project category filters
- Contact form connected to the Express API
- MongoDB-backed portfolio content and message storage
- Graceful fallback to seed content when `MONGO_URI` is not configured

## Run locally

1. Install dependencies from the repo root:

```bash
npm install
```

2. Copy the server env example and add your MongoDB connection string:

```bash
copy server\.env.example server\.env
```

3. Start the client and server together:

```bash
npm run dev
```

4. Optional: seed MongoDB with the starter portfolio:

```bash
npm run seed
```

## Scripts

- `npm run dev`: start client and server in development mode
- `npm run client`: start only the React app
- `npm run server`: start only the Express API
- `npm run build`: build the React app
- `npm run seed`: push starter portfolio content into MongoDB

## GitHub

Initialize the repo locally:

```bash
git init
git add .
git commit -m "Initial MERN portfolio"
```

Then connect your GitHub repo and push:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

## Netlify

This project includes:

- `netlify.toml` for build, publish directory, functions, and SPA redirects
- `netlify/functions/api.js` to run the Express API as a Netlify Function

### Deploy settings

- Base directory: repo root
- Build command: `npm run build`
- Publish directory: `client/dist`

### Required environment variables

Set these in Netlify if you want the API backed by MongoDB:

- `MONGO_URI`
- `CLIENT_URL`

You can set `CLIENT_URL` to your deployed Netlify site URL, for example `https://your-site-name.netlify.app`.
