# Verified Care

NDIS Provider Marketplace - Connecting participants with verified providers for domestic cleaning, community transport, and yard maintenance.

## Project Structure

```
verified-care/
├── apps/
│   ├── web/                 # Next.js 14 frontend
│   └── api/                 # NestJS backend
├── packages/
│   ├── database/            # Prisma schema & client
│   ├── shared/              # Shared types, constants, utilities
│   └── ui/                  # Shared UI components
└── ...config files
```

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **React Query** - Data fetching & caching
- **Zustand** - State management
- **React Hook Form + Zod** - Form handling & validation

### Backend
- **NestJS** - Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Passport.js** - Authentication
- **Swagger** - API documentation

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- PostgreSQL 15+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd verified-care
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your values
```

4. Set up the database:
```bash
pnpm db:push
```

5. Start development servers:
```bash
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:4000
- API Docs: http://localhost:4000/api/docs

## Development

### Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm dev:web` | Start frontend only |
| `pnpm dev:api` | Start backend only |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format all files |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Open Prisma Studio |

### Project Conventions

- **Commits**: Follow conventional commits format
- **Branches**: `feature/*`, `fix/*`, `chore/*`
- **Code Style**: Enforced by ESLint & Prettier

## Key Features

### For Participants
- Search and compare verified providers
- **Fair Price Score™** - See value, not just cost
- Dual confirmation before invoicing
- View coordinator booking transparency

### For Support Coordinators
- Multi-participant management
- Conflict of interest disclosure
- Booking on behalf of participants
- Budget tracking dashboard

### For Providers
- Compliance document management
- GPS check-in/check-out verification
- Service management & pricing
- Earnings dashboard

## Environment Variables

See `.env.example` for all required environment variables.

## License

Private - All rights reserved.

---

Built with care for the NDIS community.
