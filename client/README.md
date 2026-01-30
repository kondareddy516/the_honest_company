# Client README

This README explains how to configure and run the frontend client and how to point it to the deployed backend at:

https://the-honest-company.onrender.com/

---

## Quick overview

- The client is a Vite + React app located at `client/`.
- Requests to the API are performed via an Axios instance in `client/src/api.js`.
- By default the client uses a relative base URL (`/api`) so it works when the API is served from the same origin as the frontend (typical production setup).
- For local development you can point the client to the deployed server using a Vite environment variable (`VITE_API_BASE_URL`).

---

## Configure client to use the deployed server

You can point the running local client to the deployed API at `https://the-honest-company.onrender.com` in one of two ways:

1) Create a `.env` file inside the `client/` directory:

    VITE_API_BASE_URL=https://the-honest-company.onrender.com

2) Or set the env var