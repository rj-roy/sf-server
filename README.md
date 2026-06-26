# Startup Forge / SF Server

## Project Overview

This workspace contains a two-part startup ecosystem application:

- `startup-forge`: a Next.js frontend for a startup collaborator marketplace.
- `sf-server`: an Express backend API for MongoDB-based user, startup, opportunity, and application data.

The system supports role-based access for `admin`, `founder`, and `collaborator` users.

## Architecture

- `startup-forge` is built with Next.js 16, React 19, Tailwind CSS, and Better Auth.
- `sf-server` is a Node.js Express API that connects to MongoDB.
- The frontend uses protected fetches and bearer token authentication to call backend endpoints.
- Cloudinary is configured for image storage.

## startup-forge

### Purpose

The frontend powers the public marketing pages and the authenticated dashboard experience for all user roles.

### Key features

- Authentication and session management via `better-auth` and MongoDB.
- Role-aware routing and access control in `src/proxy.js`.
- Public pages:
  - Home
  - About
  - Opportunities list
  - Pricing
  - Startup details
- Auth pages:
  - Sign in
  - Sign up
- Dashboards:
  - Admin dashboard with user, startup, opportunity, payment, and profile management.
  - Founder dashboard with startup creation, opportunity creation, management, and application review.
  - Collaborator dashboard with opportunity browsing, application submissions, and application tracking.
- Startup creation with one startup per founder enforcement.
- Opportunity creation, edit, and delete flows for founders.
- Collaborator application creation and status cancellation.
- Admin approval workflows for startups and user status updates.

### Important frontend files

- `src/proxy.js` - middleware for route protection and redirection.
- `src/lib/auth.js` - Better Auth configuration and MongoDB adapter.
- `src/lib/core/server.js` - API request utilities and authenticated fetch helpers.
- `src/lib/core/session.js` - session retrieval and role requirement helpers.
- `src/lib/actions/` - create, patch, and delete operations for startups, opportunities, and applications.
- `src/lib/cloudinary.js` - Cloudinary client configuration.
- `src/app/` - page routes and dashboard routes.

### Dependencies

- `next` 16.2.9
- `react` 19.2.4
- `react-dom` 19.2.4
- `better-auth` 1.6.19
- `@better-auth/mongo-adapter` 1.6.19
- `cloudinary` 2.10.0
- `mongodb` 7.3.0
- `next-themes` 0.4.6
- `react-hook-form` 7.79.0
- `react-icons` 5.6.0
- `react-toastify` 11.1.0
- `tailwindcss` 4

### Frontend scripts

- `npm run dev` - launch Next.js development server
- `npm run build` - build production assets
- `npm run start` - start production server
- `npm run lint` - run ESLint

## sf-server

### Purpose

The backend serves REST API endpoints for the frontend app and enforces authentication and role authorization.

### Key features

- Express API with CORS and JSON body parsing.
- MongoDB connection and collections for users, startups, opportunities, applications, and sessions.
- Token verification middleware using a session collection.
- Role verification middleware for admin, founder, and collaborator actions.
- CRUD operations for startups and opportunities.
- Application creation and status updates.
- Startup fetching by approval status, founder, and field values.

### API endpoints

- `GET /api/users`
- `PATCH /api/users/update/status/:id`
- `PATCH /api/user/update/:id`
- `POST /api/startup/create`
- `PATCH /api/startup/status/update/:id`
- `GET /api/startups`
- `GET /api/startups/approved`
- `GET /api/startups/pending`
- `GET /api/startups/rejected`
- `GET /api/startups/field`
- `GET /api/startups/:id`
- `GET /api/startups/founder/:id`
- `PATCH /api/startup/:id`
- `DELETE /api/startup/delete/:id`
- `POST /api/opportunities/create`
- `GET /api/opportunities`
- `GET /api/opportunities/founder/:id`
- `GET /api/opportunities/startup/:id`
- `DELETE /api/opportunities/delete/:id`
- `PATCH /api/opportunities/update/:id`
- `POST /api/opportunity/application/create`
- `GET /api/application/founder/:id`
- `GET /api/application/collaborator/:id`
- `GET /api/applications`
- `PATCH /api/application/update/status/:id`
- `PATCH /api/application/update/status/cancelled/:id`

### Backend scripts

- `npm run start` - start the Express server
- `npm run dev` - start the server with `nodemon`

## Environment variables

### frontend (`startup-forge`)

- `NEXT_PUBLIC_API_URL`
- `BETTER_AUTH_BASE`
- `BETTER_AUTH_SECRET`
- `MONGODB_URI`
- `MONGODB_DB`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### backend (`sf-server`)

- `PORT`
- `DB_URI`
- `DB_NAME`
- `USERS_COLLECTION`
- `STARTUPS_COLLECTION`
- `OPPORTUNITIES_COLLECTION`
- `APPLICATIONS_COLLECTION`
- `SESSION_COLLECTION`

## Folder structure

- `sf-server/` - Express backend API
  - `index.js` - server entrypoint and route definitions
- `startup-forge/` - Next.js frontend application
  - `src/app/` - route pages and dashboard layouts
  - `src/components/` - UI components for pages and dashboards
  - `src/lib/` - authentication, API helpers, database utilities, and actions
  - `src/proxy.js` - route protection and redirects

## Notes

- `startup-forge` is the main frontend interface for users and dashboards.
- `sf-server` is the API backend with role-based middleware and MongoDB persistence.
- The two projects are designed to work together through API calls and authenticated session handling.
