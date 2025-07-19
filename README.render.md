# WalletSecure Platform - Render Deployment

## Deployment Instructions

### 1. Prepare for Render Deployment

1. Create a new repository on GitHub and push this code
2. Connect your GitHub account to Render
3. Create a new Web Service in Render

### 2. Render Configuration

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: Node
- **Node Version**: 20

### 3. Environment Variables

Set these environment variables in Render:

**Required:**
- `NODE_ENV=production`
- `DATABASE_URL` (PostgreSQL connection string)

**Optional (for Telegram notifications):**
- `TELEGRAM_BOT_TOKEN` (Your Telegram bot token)
- `TELEGRAM_CHAT_ID` (Your Telegram chat ID)

### 4. Database Setup

1. Create a PostgreSQL database in Render
2. Copy the connection string to `DATABASE_URL` environment variable
3. Run database migrations after deployment

### 5. Domain Configuration

- Render will provide a `.onrender.com` domain
- Configure custom domain in Render dashboard if needed
- SSL certificates are automatically managed by Render

### 6. Health Checks

The application runs on port 5000 by default, but Render will set the `PORT` environment variable.

### 7. Deployment Methods

**Option 1: Using render.yaml (recommended)**
```yaml
services:
  - type: web
    name: walletsecure-platform
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
```

**Option 2: Manual configuration in Render dashboard**

### 8. Post-deployment

1. Verify the application is running
2. Test the security alert page
3. Test wallet verification flow
4. Configure Telegram bot if needed

### Troubleshooting

- Check Render logs for any deployment issues
- Ensure all environment variables are set correctly
- Verify database connectivity
- Check that the build command completes successfully

### Security Notes

- Never commit sensitive environment variables
- Use Render's environment variable management
- Regularly update dependencies for security patches