# Railway Deployment Guide

This project is configured for deployment on Railway.

## Prerequisites

1. A Railway account (sign up at https://railway.app)
2. A PostgreSQL database on Railway
3. This GitHub repository connected to Railway

## Deployment Steps

### 1. Create a New Project on Railway

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `pipmasonconsult-max/CHORESAPP`

### 2. Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically provision a PostgreSQL database

### 3. Configure Environment Variables

Railway will automatically set `DATABASE_URL` from the PostgreSQL service. You need to add these additional variables:

**Required Variables:**
- `NODE_ENV` = `production`
- `JWT_SECRET` = (generate a random string, e.g., use `openssl rand -base64 32`)
- `VITE_APP_TITLE` = `Pocket Money & Chore Tracker`

**Optional Variables:**
- `PORT` = `3000` (Railway sets this automatically, but you can override)

### 4. Configure Build & Start Commands

Railway should auto-detect the build configuration from `railway.json`, but verify:

**Build Command:** `pnpm install && pnpm build`
**Start Command:** `pnpm start`

### 5. Deploy

1. Click "Deploy" in Railway
2. Wait for the build to complete
3. Railway will provide you with a public URL

## Database Migrations

After first deployment, you need to push the database schema:

1. In Railway, go to your PostgreSQL database
2. Copy the `DATABASE_URL` connection string
3. Run locally: `DATABASE_URL="your-railway-db-url" pnpm db:push`

Alternatively, add a deploy script that runs migrations automatically.

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes (auto-set by Railway) |
| `NODE_ENV` | Environment mode | Yes |
| `JWT_SECRET` | Secret for JWT token generation | Yes |
| `VITE_APP_TITLE` | Application title | Yes |
| `PORT` | Server port | No (auto-set by Railway) |

## Monitoring

- View logs in the Railway dashboard
- Monitor resource usage and metrics
- Set up alerts for downtime

## Custom Domain (Optional)

1. In Railway project settings, go to "Domains"
2. Click "Add Domain"
3. Follow instructions to configure DNS

## Troubleshooting

**Build fails:**
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility

**Database connection errors:**
- Ensure `DATABASE_URL` is set correctly
- Check that database migrations have been run

**App crashes on startup:**
- Review logs in Railway dashboard
- Verify all required environment variables are set
