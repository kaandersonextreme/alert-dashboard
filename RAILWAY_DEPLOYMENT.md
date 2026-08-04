# Railway Deployment Guide

Your Alert Correlation Dashboard is ready to deploy to Railway!

## What's Included

✅ **Dockerfile** - Multi-stage build optimized for production  
✅ **railway.json** - Railway configuration  
✅ **package.json** - Dependencies (axios, lucide-react, React 19)  
✅ **Environment variable support** - REACT_APP_API_URL  
✅ **.env.example** - Template for environment variables  
✅ **README.md** - Complete documentation  

## Quick Start (2 Steps)

### 1. Push to GitHub

```bash
cd /home/user/alert-dashboard
git add .
git commit -m "Add Alert Correlation Dashboard"
git push
```

### 2. Deploy on Railway.app

Visit https://railway.app:
1. Create a new project
2. Click "Deploy from GitHub"
3. Select your alert-dashboard repository
4. Add environment variable: `REACT_APP_API_URL`
5. Click Deploy!

That's it! Railway will build and deploy automatically.

## Configuration

### Environment Variables

Set these in Railway dashboard (Variables tab):

| Variable | Value | Example |
|----------|-------|---------|
| `REACT_APP_API_URL` | API server URL | `https://api.railway.app` |

### Build Configuration

Railway will:
1. Detect the Dockerfile automatically
2. Build the React app: `npm run build`
3. Serve with `serve -s build`
4. Expose on port 3000

## After Deployment

1. Railway provides a public URL: `https://your-app.railway.app`
2. Open it in your browser
3. Click "Load Demo Data" to test
4. Browse alerts and view root cause analysis

## Updating

Simply push updates to GitHub:
```bash
git add .
git commit -m "Update dashboard"
git push
```

Railway auto-redeploys on every push!

## Troubleshooting

**Build fails?**
- Check: `npm install && npm run build` work locally
- View Railway build logs for errors

**App doesn't connect to API?**
- Verify `REACT_APP_API_URL` is set correctly
- Ensure API is accessible from Railway

**Need help?**
- Check Railway docs: https://docs.railway.app
- Check app logs in Railway dashboard

---

🚀 Happy deploying!
