# Folkline CRM

A full-stack, open-source CRM for modern sales teams. Track deals across a visual Kanban pipeline with authentication and a real database backend.

## Features

- **Sales Pipeline** — Four deal stages: Qualified → Proposal → Negotiation → Closing
- **User Authentication** — Register and sign in with email/password (NextAuth + JWT)
- **Persistent Storage** — All deals saved to a local SQLite database via Prisma
- **One-Click Progression** — Move deals between stages with a single click
- **Add / Delete Deals** — Full CRUD for sales opportunities
- **Searchable Deal Board** — Filter deals across all stages
- **Demo Mode** — Pre-seeded with sample data to explore immediately
- **Responsive UI** — Works on desktop, tablet, and mobile
- **MIT Licensed** — Free to use, modify, and distribute

## Tech Stack

- **Framework:** Next.js 16 (React 19) — App Router
- **Language:** TypeScript
- **Database:** SQLite via Prisma ORM
- **Authentication:** NextAuth (Credentials provider, JWT sessions)
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Initialize the database (creates dev.db + seeds demo data)
npm run db:push
npm run db:seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo Credentials

After running `npm run db:seed`, log in with:

```
Email:    demo@folkline.io
Password: demo1234
```

Or register a new account directly from the login page.

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio (GUI database browser) |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/register` | Create a new user account |
| GET | `/api/deals` | List all deals for the current user |
| POST | `/api/deals` | Create a new deal |
| PATCH | `/api/deals/[id]` | Update a deal (e.g. advance stage) |
| DELETE | `/api/deals/[id]` | Delete a deal |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   NextAuth route handler
│   │   ├── deals/               Deals CRUD API
│   │   └── register/            User registration API
│   ├── login/                   Login / register page
│   ├── globals.css              Global styles
│   ├── layout.tsx               Root layout with SessionProvider
│   └── page.tsx                 Kanban board dashboard
├── components/
│   └── SessionProvider.tsx       Auth session context wrapper
├── lib/
│   ├── auth.ts                  NextAuth configuration
│   └── prisma.ts                Prisma client singleton
└── middleware.ts                 Route protection (auth redirect)
```

## License

MIT — see [LICENSE](LICENSE). Free for personal and commercial use.
