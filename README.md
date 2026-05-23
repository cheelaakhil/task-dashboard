# TaskFlow — Mini Task Management Dashboard

A full-stack web application to create, manage, update, and track tasks. Built for the HedgeOne Consultants LLP Full Stack Developer Intern screening project.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14 (App Router), React 18   |
| Styling    | Tailwind CSS + custom CSS variables |
| Backend    | Node.js + Express.js                |
| Database   | Supabase (PostgreSQL)               |
| HTTP Client| Axios                               |
| Validation | express-validator                   |

---

## Setup Instructions

### 1. Supabase Setup (Database)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** → **New Query**
4. Paste the contents of `schema.sql` and run it
5. Go to **Project Settings** → **API** and copy:
   - **Project URL** (e.g. `https://xyz.supabase.co`)
   - **Service Role Key** (under "Project API keys")

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
SUPABASE_URL=your_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev
```

Server runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

App runs at: `http://localhost:3000`

---

## AI Tools Used

- **Claude (Anthropic)** — Used for code generation assistance and component structure planning.
- **GitHub Copilot** — Inline code suggestions during development.

---

## Author

Built by Cheela Akhil as a screening project submission for HedgeOne Consultants LLP — Full Stack Developer Intern, Summer 2026.
