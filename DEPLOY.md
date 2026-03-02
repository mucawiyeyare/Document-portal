# Document Portal — Deployment Guide

Complete guide for deploying the **Document Portal** (Express backend + Vite/React frontend) to either **Render** or **Railway**.

---

## Prerequisites

- ✅ Code pushed to a **GitHub repository**
- ✅ **MongoDB Atlas** cluster set up (connection string ready)
- ✅ A strong `JWT_SECRET` (generate one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

---

## Option A — Deploy to Render (Recommended)

Render can deploy both services from a single `render.yaml` Blueprint.

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

### Step 2 — Create a Render account

Go to [https://render.com](https://render.com) and sign up / log in.

### Step 3 — Deploy via Blueprint

1. In Render dashboard click **"New +"** → **"Blueprint"**
2. Connect your GitHub account and select your repository
3. Render will detect `render.yaml` and show 2 services:
   - `document-portal-backend` (Web Service)
   - `document-portal-frontend` (Static Site)
4. Click **"Apply"**

### Step 4 — Set Secret Environment Variables

In the **backend** service → **Environment** tab, set:

| Key | Value |
|-----|-------|
| `MONGO_URI` | `mongodb+srv://Documment-portal:<password>@cluster0.ufrhjzd.mongodb.net/secure_student_files?retryWrites=true&w=majority` |
| `JWT_SECRET` | *(your generated secret)* |

> The `FRONTEND_URL` is automatically linked to the frontend service by `render.yaml`.

In the **frontend** static site → **Environment** tab, set:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://document-portal-backend.onrender.com/api` |

*(Replace with the actual backend URL shown in the Render dashboard after first deploy)*

### Step 5 — Trigger Deploy

Render deploys automatically after saving env vars. Visit the frontend URL once both services show **"Live"**.

---

## Option B — Deploy to Railway

Railway lets you deploy each service (backend + frontend) as a separate Railway service within one project.

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

### Step 2 — Create a Railway account

Go to [https://railway.app](https://railway.app) and sign up / log in.

### Step 3 — Deploy Backend

1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your repository
3. Railway will detect Node.js automatically
4. In service settings → **Settings** tab:
   - Set **Root Directory** to `server`
   - Set **Start Command** to `node server.js`
5. In **Variables** tab, add:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGO_URI` | *(your Atlas URI)* |
| `JWT_SECRET` | *(your generated secret)* |
| `FRONTEND_URL` | *(leave empty for now, add after frontend is deployed)* |

6. Click **"Deploy"** — note the generated backend URL (e.g. `https://xxx.railway.app`)

### Step 4 — Deploy Frontend

1. In the same Railway project, click **"New Service"** → **"GitHub Repo"** → same repo
2. In service settings:
   - Set **Root Directory** to `client`
   - Set **Build Command** to `npm install && npm run build`
   - Set **Start Command** to `npx serve dist -p $PORT` *(Railway needs a process even for static sites)*
3. In **Variables** tab, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend.railway.app/api` |

4. Go back to backend service → **Variables** → set `FRONTEND_URL` to the frontend Railway URL.
5. Railway auto-deploys on variable changes.

---

## ⚠️ Important Notes

### File Uploads (Ephemeral Storage)
Both Render and Railway have **ephemeral filesystems** — uploaded files in `server/uploads/` **will be deleted on every restart or redeploy**. This is fine for demos. For production, migrate file storage to:
- [Cloudinary](https://cloudinary.com) (free tier available)
- [AWS S3](https://aws.amazon.com/s3/)
- [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html)

### Free Tier Limits
| Platform | Backend | Frontend |
|----------|---------|----------|
| Render | Spins down after 15 min inactivity (cold start ~30s) | Always on |
| Railway | $5/month free credits | Same service |

### MongoDB Atlas Network Access
Make sure your Atlas cluster allows connections from anywhere (`0.0.0.0/0`) or whitelist the Render/Railway IP ranges.
In Atlas dashboard → **Network Access** → **Add IP Address** → **Allow Access from Anywhere**.

---

## Environment Variables Summary

### Backend (`server/`)
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (Render/Railway set this automatically) | Auto |
| `MONGO_URI` | MongoDB Atlas connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | ✅ |
| `FRONTEND_URL` | Deployed frontend URL (for CORS) | ✅ |

### Frontend (`client/`)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Full URL to backend API e.g. `https://xxx.onrender.com/api` | ✅ |

---

## Local Development (unchanged)

```bash
# Terminal 1 — Backend
cd server
npm install
npm run dev      # nodemon server.js on port 5000

# Terminal 2 — Frontend  
cd client
npm install
npm run dev      # Vite dev server on port 5173 (proxies /api → localhost:5000)
```
