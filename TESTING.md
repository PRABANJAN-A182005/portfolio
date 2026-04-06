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
- Helpful error response when neither MongoDB nor SMTP email delivery is configured
- Contact message normalization before delivery and saving
- Email forwarding behavior for contact submissions
- Netlify function export smoke test

## Manual hosted checklist

1. In Netlify, set `MONGO_URI`.
2. In Netlify, set `CLIENT_URL` to your site URL.
3. In Netlify, set `CONTACT_INBOX`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`.
4. Open the deployed site and confirm the `Contact` section is visible.
5. Submit the contact form with valid data.
6. Confirm the request succeeds, the message appears in MongoDB, and the inbox receives the email.
7. Refresh the site and confirm portfolio data still loads.
8. Open `/api/health` and confirm `database` reports `connected`.
