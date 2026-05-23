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

## Features

- **Full Task CRUD** — Create, read, update, and delete tasks
- **Task fields** — Title, description, status, due date
- **Status management** — Todo / In Progress / Completed; click badge on card to cycle
- **Search** — Filter tasks by title or description
- **Status filter** — Filter by All / Todo / In Progress / Completed
- **Sorting** — Sort by date created, due date, or alphabetically
- **Stats overview** — Live counts and progress bar
- **Due date highlighting** — Overdue tasks and tasks due today are color-coded
- **Keyboard shortcut** — Press `Esc` to close modal

---

## Project Structure

```
task-dashboard/
├── backend/
│   ├── config/
│   │   └── supabase.js        # Supabase client setup
│   ├── routes/
│   │   └── tasks.js           # All task CRUD routes
│   ├── server.js              # Express app entry point
│   ├── .env.example           # Environment variable template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css    # Global styles + CSS variables
│   │   │   ├── layout.js      # Root layout
│   │   │   └── page.js        # Main dashboard page
│   │   ├── components/
│   │   │   ├── TaskCard.js    # Individual task card
│   │   │   ├── TaskModal.js   # Create/edit modal
│   │   │   └── StatsBar.js    # Overview statistics
│   │   ├── hooks/
│   │   │   └── useTasks.js    # Custom hook for task CRUD
│   │   └── lib/
│   │       └── api.js         # Axios API client
│   ├── .env.example
│   └── package.json
└── schema.sql                 # Supabase table setup SQL
```

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

---

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
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

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

## API Endpoints

| Method | Endpoint                   | Description               |
|--------|----------------------------|---------------------------|
| GET    | `/api/tasks`               | Get all tasks (filterable)|
| GET    | `/api/tasks/:id`           | Get a single task         |
| POST   | `/api/tasks`               | Create a new task         |
| PUT    | `/api/tasks/:id`           | Update a task             |
| PATCH  | `/api/tasks/:id/status`    | Update status only        |
| DELETE | `/api/tasks/:id`           | Delete a task             |
| GET    | `/health`                  | Health check              |

### Query Parameters for GET `/api/tasks`

| Param     | Values                              | Description       |
|-----------|-------------------------------------|-------------------|
| `status`  | `todo`, `in_progress`, `completed`  | Filter by status  |
| `search`  | any string                          | Search title/desc |
| `sort_by` | `created_at`, `due_date`, `title`   | Sort field        |
| `order`   | `asc`, `desc`                       | Sort direction    |

---

## AI Tools Used

- **Claude (Anthropic)** — Used for code generation assistance, component structure planning, and README drafting.
- **GitHub Copilot** — Inline code suggestions during development.

---

## Author

Built as a screening project submission for HedgeOne Consultants LLP — Full Stack Developer Intern, Summer 2026.
