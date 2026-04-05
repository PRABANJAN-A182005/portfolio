# Testing Guide

## Automated checks

Run the backend and integration tests:

```bash
npm test
```

Run a production build for the frontend:

```bash
npm run build
```

## What is covered

- API health route
- Portfolio fallback content when MongoDB is disconnected
- Portfolio database response path
- Contact form validation for required fields
- Email validation for contact submissions
- Helpful error response when hosted without MongoDB
- Contact message normalization before saving
- Netlify function export smoke test

## Manual hosted checklist

1. In Netlify, set `MONGO_URI`.
2. In Netlify, set `CLIENT_URL` to your site URL.
3. Open the deployed site and confirm the `Contact` section is visible.
4. Submit the contact form with valid data.
5. Confirm the request succeeds and the message appears in MongoDB.
6. Refresh the site and confirm portfolio data still loads.
7. Open `/api/health` and confirm `database` reports `connected`.
