# MukeshPM — AI-Powered Project Management Dashboard 🚀

### 🔗 Production Live Deployments:
- 💻 **Live Web Application**: [https://ai-project-dashboard-two.vercel.app/](https://ai-project-dashboard-two.vercel.app/)
- 📡 **Live Backend API**: [https://ai-project-dashboard-jcf4.onrender.com](https://ai-project-dashboard-jcf4.onrender.com)

---

A production-level, enterprise-grade full-stack project management application crafted for the **WEEK 4 – Capstone Project & Deployment** internship assignment. Inspired by premium features of **Trello, Jira, and Asana**, the application integrates an interactive Kanban board (drag-and-drop), deep statistical charts, Multer-based file uploading, collaborative comments timelines, role-based authorization, and **Google Gemini API intelligence**.

---

## 🌟 Application Features

1. **Authentication System (JWT & bcryptjs)**:
   - Full credentials registration & logins.
   - Protected client routers and protected Express APIs.
   - Role-based privileges: `Admin`, `Manager`, and `Member`.
2. **Interactive Kanban Board (dnd-kit)**:
   - Trello-style drag-and-drop columns (`Todo`, `In Progress`, `Review`, `Completed`).
   - Persistent database updates on column shift.
   - Responsive design with smooth visual transitions.
3. **Core Dashboard & Timeline Logs**:
   - Aggregate numbers: projects tally, total tasks, and workload completion rates.
   - Cron-like timeline logs documenting squad updates.
4. **Task attachments (Multer)**:
   - Restricts file type uploads (Images, PDFs, ZIPs, Office documents).
   - Validates file size (Max 10MB limit) and stores local web URLs dynamically.
5. **Analytics & Metrics (Recharts)**:
   - Status distribution charts (Bar).
   - Priority density splits (Pie).
   - Squad workload ratios (Grouped completion rates).
6. **Gemini Core AI Assistant**:
   - **Smart Priorities**: Analyzes task description to suggest appropriate High/Medium/Low priority.
   - **Executive Summaries**: Compiles summary bullets and yields productivity guidelines for task cards.
7. **Premium Glassmorphic UI**:
   - Dark & Light mode toggle with persistent state.
   - Skeleton loaders during api fetches.
   - Custom styled scrollbars.

---

## 🛠️ Technology Stack

**Frontend**:
- React.js (Vite core template)
- Tailwind CSS (Premium glassmorphic mesh styling)
- React Router DOM (Dynamic protection)
- Axios (Interceptors for Bearer tokens)
- Context API (Auth and Theme nodes)
- Recharts (Animated SVG charts)
- `@dnd-kit/core` (High-performance pointer drag-and-drop)
- Lucide React (Clean, modern iconography)

**Backend**:
- Node.js & Express.js (MVC architecture)
- MongoDB Atlas & Mongoose (Schemas validation)
- JWT Authentication (jsonwebtoken)
- bcryptjs (Secure bcrypt hashing)
- Multer (Multipart attachments file processor)

---

## 📁 Repository Structure

```
ai-project-dashboard/
├── backend/
│   ├── config/             # DB & AI configurations
│   ├── controllers/        # REST controllers (auth, projects, tasks, comments, uploads)
│   ├── middleware/         # Custom middlewares (auth protection, multer limits, error interceptors)
│   ├── models/             # Mongoose schemas definitions
│   ├── routes/             # Express routing lines
│   ├── uploads/            # Local static directory hosting attachments
│   ├── .env                # Server credentials
│   ├── package.json        
│   └── server.js           # Server execution entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/     # UI elements (KanbanBoard, Sidebar, Header, etc.)
│   │   ├── context/        # Session AuthContext & ThemeContext
│   │   ├── layouts/        # DashboardLayout mapping protected routes
│   │   ├── pages/          # Full page views (LandingPage, LoginPage, RegisterPage, Dashboard, etc.)
│   │   ├── services/       # Axios API configurations with Bearer interceptors
│   │   ├── App.jsx         # Router path declarations
│   │   ├── index.css       # Styling base class rules & glass overrides
│   │   └── main.jsx        # Mounting entry point
│   ├── index.html          
│   ├── tailwind.config.js  
│   ├── vite.config.js      # Dev server proxies configurations
│   └── package.json        
└── README.md
```

---

## 🚀 Installation & Local Execution

### Prerequisites:
- **Node.js** (v18+ recommended)
- **MongoDB** (local server running or MongoDB Atlas connection link)

### 1. Set Up the Backend
1. Open the `/backend` directory.
2. Build a `.env` file containing:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/ai_project_dashboard
   JWT_SECRET=production_secret_key_998877
   NODE_ENV=development
   GEMINI_API_KEY=your_google_gemini_key_here
   ```
   *(Note: If `GEMINI_API_KEY` is omitted, the assistant seamlessly falls back to local smart estimation logs without crashing).*
3. Run installation and spin up server:
   ```bash
   npm install
   npm start
   ```

### 2. Set Up the Frontend
1. Open the `/frontend` directory.
2. Run installation and launch Vite server:
   ```bash
   npm install
   npm run dev
   ```
3. Open browser on [http://localhost:5173](http://localhost:5173).

---

## 📡 REST API Specifications

| Method | Endpoint | Description | Protected | Roles |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register new profile account | No | Any |
| **POST** | `/api/auth/login` | Login user, obtain JWT token | No | Any |
| **GET** | `/api/auth/profile` | Fetch active user credentials | Yes | Any |
| **GET** | `/api/auth/users` | List all system workspace users | Yes | Any |
| **POST** | `/api/projects` | Create a new board workspace | Yes | Admin, Manager |
| **GET** | `/api/projects` | List all boards user is member of | Yes | Any |
| **PUT** | `/api/projects/:id` | Edit project metadata, add team | Yes | Admin, Manager |
| **DELETE** | `/api/projects/:id` | Remove project & delete child tasks | Yes | Admin, Manager |
| **POST** | `/api/tasks` | Create task card inside board | Yes | Any |
| **GET** | `/api/tasks/project/:projectId` | Fetch board cards (handles search/filters) | Yes | Any |
| **PUT** | `/api/tasks/:id` | Update task fields (moves statuses columns) | Yes | Any |
| **POST** | `/api/tasks/:id/ai-assist` | Call Gemini assistant for card summaries/priority | Yes | Any |
| **POST** | `/api/comments` | Post collaborative comment on task card | Yes | Any |
| **POST** | `/api/uploads` | Upload card static attachment files (Max 10MB) | Yes | Any |

---

## ☁️ Deployment Guidelines

### 1. Database (MongoDB Atlas)
1. Register on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free M0 database cluster and obtain your `Connection String`.
3. Whitelist access IP rules (`0.0.0.0/0` for cloud deployments).

### 2. Backend API (Render)
1. Create account on [Render](https://render.com/).
2. Setup a new **Web Service** linking your repository.
3. Configure the start command: `npm install && npm start` (under backend path).
4. Declare Environment variables under settings:
   - `PORT = 10000` (Render default)
   - `MONGO_URI = [Your Atlas URL]`
   - `JWT_SECRET = [Secure Key]`
   - `NODE_ENV = production`
   - `GEMINI_API_KEY = [Google Key]`

### 3. Frontend Portal (Vercel)
1. Create account on [Vercel](https://vercel.com/).
2. Link repository, select directory `/frontend`.
3. Ensure Framework Presets are set to **Vite**.
4. Configure production environment URL mapping inside `vite.config.js` or set proxy configuration to render service target URL.
5. Deploy.
