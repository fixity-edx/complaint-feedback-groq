# Complaint / Feedback System (Groq AI + JWT + RBAC) ✅

A final-year BTech full-stack mini project.

✅ Frontend: React (Vite) + TailwindCSS (Glassmorphism / Liquid Glass UI)  
✅ Backend: Node.js + Express.js  
✅ MongoDB Atlas (free tier)  
✅ AI: Groq API (console.groq.com) → Complaint **Summary + Classification**  
✅ Security by default: JWT, bcrypt hashing, RBAC, validation, sanitization, Helmet, rate limit, optional CSRF  

---

## Folder Structure
```
complaint-feedback-groq-rbac/
  frontend/
  backend/
  README.md
```

---

# Features

## MVP
- Submit complaint/feedback (title, description, category)
- View complaints
- Admin can update status (Pending/Resolved)
- Admin can generate AI Summary + AI Category

## Advanced (Included)
- Dashboard analytics for admin (total/pending/resolved)
- Optional email notifications with Resend (free tier)

---

# 1) Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Backend: `http://localhost:5000`

Set `.env` values:
- `MONGODB_URI`
- `JWT_SECRET`
- `GROQ_API_KEY`

---

# 2) Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend: `http://localhost:5173`

---

# 3) Create Admin User (RBAC)

All signups start with role `user`.

To make admin:
1. Signup once from UI
2. MongoDB Atlas → Collections → `users`
3. Change:
```json
"role": "admin"
```

Login again → admin dashboard enabled.

---

# 4) Groq AI Setup (FREE)

1. Get API key from **console.groq.com**
2. Add to backend `.env`:
```
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

AI Endpoint:
- Admin only: `POST /api/complaints/:id/ai-summarize`

---

# Optional Emails (Resend Free)

1. Create account at Resend
2. Add:
```
RESEND_API_KEY=...
ADMIN_EMAIL=delivered@resend.dev
```

---

# Deployment (Free Tier)

## Backend → Render
- Root directory: `backend`
- Build command: `npm install`
- Start: `npm start`
- Add env variables in Render dashboard

## Frontend → Vercel
- Root directory: `frontend`
- Add env:
```
VITE_API_BASE_URL=https://<render-backend-url>
```

---

# Security Points (For Viva)
- bcrypt hashed password storage
- JWT authentication + expiry
- logout invalidation using blacklist (MongoDB TTL)
- Helmet headers
- Rate limiting
- Input validation & sanitization
- Optional CSRF support (`ENABLE_CSRF=1`)
- HTTPS recommended for deployment

---

## Author
Final Year BTech Mini Project - Complaint / Feedback System
