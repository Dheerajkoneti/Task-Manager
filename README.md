🚀 Task Manager – Focus Lock Productivity App
A full-stack productivity and focus management application that helps users plan tasks, stay focused, and complete work efficiently using focus-time–based task completion, smart reminders, AI motivational messages, and streak tracking.
Built with React + TypeScript (Frontend) and Node.js + Express + Prisma (Backend), with PWA support and real-time automation.
✨ Features
📂Task Management
Create, edit, and delete tasks
Task states:
TODO
IN PROGRESS
DONE
MISSED
Automatic task state transitions based on time
⏱ Focus-Based Completion (Core Feature)
Start Focus Mode for a task
If focus runs till end → task is automatically marked DONE
Exit focus early → task stays TODO / MISSED
No manual clicking required (tick button optional)
🔥 Productivity & Motivation
Daily streak tracking
Longest streak record
Focus session counter
AI-generated motivational messages based on:
Streak
Focus sessions
Missed tasks
Current context (idle / focus / completion)
🔔 Smart Human-like Reminders
“⏰ Focus time starts in 5 mins”
“🔥 You’re on a 3-day streak”
“❌ You missed 2 tasks yesterday”
📊 Analytics
Weekly productivity bar chart
Daily summary:
Tasks completed today
Focus time
Missed tasks
🛠 Tech Stack
Frontend
React + TypeScript
Vite
Recharts (Charts)
React Router
React Hot Toast
PWA (manifest + icons)
Backend
Node.js
Express
TypeScript
Prisma ORM
PostgreSQL / SQLite
JWT Authentication
Deployment
Frontend: Vercel
Backend: Render
Version Control: Git + GitHub
📂 Project Structure
TASK-MANAGER/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── server.ts
│   ├── prisma/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   │   ├── icons/
│   │   └── manifest.json
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md

