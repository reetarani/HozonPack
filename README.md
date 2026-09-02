# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Production / Deployment Notes (added)

1. Environment

- Create a .env file (do not commit) or use a secret manager. A sample is provided at [backend/.env.example](C:/Users/User/Desktop/hozonpack-v2.worktrees/mern-project-review-hozonepack-v2/backend/.env.example).

Required env vars (example):

- MONGO_URI
- JWT_SECRET
- FRONTEND_URL
- NODE_ENV=production
- PORT

2. Security & hardening added

- Helmet, rate limiting, request sanitization, XSS cleaning, HPP and compression have been added to the backend app for basic hardening.
- A global error handler and 404 handler were added.

3. Media storage

- Do not commit uploaded media into the repository. The backend/src/uploads folder is now ignored in .gitignore. Move media to S3 or similar object storage for production.

4. Next steps (recommended)

- Add Dockerfile and health/readiness endpoints.
- Add CI that runs lint, tests, and dependency scans (Dependabot/Snyk).
- Implement refresh tokens with rotation and token invalidation for logout.
- Add input validation (Joi/express-validator) for all endpoints.

