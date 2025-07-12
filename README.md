# Invoice-X Monorepo

A modern, full-stack invoice management application built with a TypeScript/React frontend and a Hono/Drizzle backend. This monorepo uses pnpm workspaces for efficient dependency management and development workflow.

## Technologies Used

### Frontend
- **React 19**
- **TypeScript**
- **Vite**
- **TailwindCSS 4**
- **@tanstack/react-query, react-router, zod-adapter**
- **React Aria Components**
- **Zustand** (state management)
- **PDF.js** (PDF viewing)

### Backend
- **Node.js** (TypeScript)
- **Hono** (web framework)
- **Drizzle ORM** (database)
- **Zod** (validation)
- **Neon Database** (Postgres serverless)
- **Bcrypt** (password hashing)
- **React PDF Renderer** (PDF generation)

## Features
- User authentication (login, JWT, password hashing)
- Client management (CRUD)
- Invoice management (CRUD, PDF generation, download)
- Responsive, accessible UI
- Modern component libraries and utility hooks
- API-first architecture
- Monorepo with pnpm workspaces for easy development

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (v8+ recommended)

### Install dependencies
```sh
pnpm install
```

### Development
Run both frontend and backend in parallel:
```sh
pnpm dev
```
Or run individually:
```sh
pnpm dev:frontend
pnpm dev:backend
```

### Build
```sh
pnpm build
```

## Project Structure
```
frontend/   # React app (Vite, Tailwind, etc.)
backend/    # Hono API server (TypeScript, Drizzle ORM)
```

## License
MIT
