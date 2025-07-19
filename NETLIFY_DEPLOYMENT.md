# Netlify Deployment Guide for WalletSecure

## Pre-Deployment Checklist ✅

Your app is now fully ready for Netlify deployment with these configurations:

### Files Created/Modified:
- ✅ `netlify.toml` - Netlify configuration with build settings
- ✅ `netlify/functions/send-telegram.js` - Serverless function for Telegram API
- ✅ `package.netlify.json` - Frontend-only dependencies
- ✅ `vite.config.netlify.ts` - Netlify-specific Vite config
- ✅ `_redirects` - URL routing for SPA and API functions
- ✅ Frontend code updated to use environment-based API URLs

## Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - WalletSecure for Netlify"
git branch -M main
git remote add origin https://github.com/yourusername/walletsecure.git
git push -u origin main
```

### 2. Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account
4. Select your repository
5. Netlify will auto-detect the build settings from `netlify.toml`

### 3. Set Environment Variables in Netlify

**Method 1: Netlify Dashboard (Recommended)**
1. Go to your site dashboard
2. Click "Site settings" → "Environment variables"
3. Add these variables:

```
TELEGRAM_BOT_TOKEN = your_bot_token_here
TELEGRAM_CHAT_ID = your_chat_id_here
```

**Method 2: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Set environment variables
netlify env:set TELEGRAM_BOT_TOKEN "your_bot_token_here"
netlify env:set TELEGRAM_CHAT_ID "your_chat_id_here"
```

### 4. Deploy
- Netlify will automatically build and deploy your site
- Build command: `cp package.netlify.json package.json && cp vite.config.netlify.ts vite.config.ts && npm install && npm run build`
- Publish directory: `dist/public`

## How Environment Variables Work on Netlify

### For Serverless Functions:
- Environment variables are automatically available as `process.env.VARIABLE_NAME`
- No additional configuration needed
- They're securely stored and not exposed to the frontend

### For Frontend (if needed):
- Must be prefixed with `VITE_` to be accessible
- Available as `import.meta.env.VITE_VARIABLE_NAME`
- These are public (visible in browser)

### Your Setup:
- `TELEGRAM_BOT_TOKEN` → Backend function only (secure)
- `TELEGRAM_CHAT_ID` → Backend function only (secure)
- `VITE_API_URL` → Set automatically to `/.netlify/functions`

## Post-Deployment

### Your Live URLs:
- **Website**: `https://your-site-name.netlify.app`
- **API Function**: `https://your-site-name.netlify.app/.netlify/functions/send-telegram`

### Testing:
1. Visit your site URL
2. Test the wallet verification flow
3. Check that Telegram messages are received
4. Monitor function logs in Netlify dashboard

## Environment Variables Security

✅ **Secure**: Backend environment variables (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`)
- Not accessible from frontend
- Encrypted at rest
- Only available to serverless functions

❌ **Public**: Frontend environment variables (prefixed with `VITE_`)
- Visible in browser dev tools
- Don't put sensitive data here

## Troubleshooting

### Function Logs:
- Go to Netlify dashboard → Functions → View logs
- Check for environment variable errors
- Monitor Telegram API responses

### Build Issues:
- Check build logs in Netlify dashboard
- Verify all files are committed to Git
- Ensure `package.netlify.json` dependencies are correct
- Make sure both `package.netlify.json` and `vite.config.netlify.ts` are in your repository

### Common Errors:
- **"vite: not found"**: The build is using wrong package.json - ensure `package.netlify.json` is committed
- **"esbuild" errors**: This means it's trying to build server code - the netlify.toml will fix this

## Advantages of This Setup:

✅ **Free hosting** - No monthly costs
✅ **Global CDN** - Fast loading worldwide  
✅ **Auto-scaling** - Handles traffic spikes
✅ **HTTPS included** - Secure by default
✅ **Custom domains** - Easy to add your own domain
✅ **Instant deploys** - Git-based deployment

Your WalletSecure app is now production-ready for Netlify! 🚀