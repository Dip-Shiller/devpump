# Deployment Guide - DevPump

Quick guide to deploy DevPump to production tonight.

## Option 1: Vercel (Recommended - 5 minutes)

Vercel is the easiest way to deploy Next.js apps with zero configuration.

### Steps

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click **"New Project"**
   - Import your `devpump` repository

3. **Configure Environment Variables**
   
   In the Vercel project settings, add these environment variables:
   
   ```env
   # Solana
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   
   # Supabase (from your Supabase project)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   
   **Important:** Use `mainnet-beta` for production, or stick with `devnet` for testing.

4. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete
   - Get your live URL: `your-project.vercel.app`

### Custom Domain (Optional)

1. In Vercel project settings, go to **Domains**
2. Add your custom domain (e.g., `devpump.com`)
3. Update your DNS records as instructed
4. SSL certificate is automatically provisioned

---

## Option 2: Netlify (Alternative)

### Steps

1. **Push code to GitHub**

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click **"Add new site"** → **"Import an existing project"**
   - Connect your GitHub repository

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18+

4. **Environment Variables**
   
   Add the same environment variables as Vercel (see above)

5. **Deploy**

---

## Option 3: Self-Hosted (Advanced)

### Prerequisites
- Ubuntu/Debian server with Node.js 18+
- Nginx for reverse proxy
- PM2 for process management

### Steps

1. **Clone repository on server**
   ```bash
   git clone https://github.com/your-username/devpump.git
   cd devpump
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   **Note**: You may see warnings about React peer dependencies and deprecated packages. These are normal and won't prevent deployment.

3. **Create production .env**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your production values
   ```

4. **Build the app**
   ```bash
   npm run build
   ```

5. **Install PM2**
   ```bash
   npm install -g pm2
   ```

6. **Start with PM2**
   ```bash
   pm2 start npm --name "devpump" -- start
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Pre-Deployment Checklist

Before deploying, make sure you've:

- [ ] Set up Supabase and ran the schema (`lib/schema.sql`)
- [ ] Configured all environment variables
- [ ] Tested signup and login locally
- [ ] **Installed dependencies** (`npm install` - warnings are normal)
- [ ] **Built successfully** (`npm run build` - should complete without errors)
- [ ] Changed `NEXT_PUBLIC_SOLANA_NETWORK` to `mainnet-beta` (if going live)
- [ ] Updated Solana RPC to a paid endpoint (Helius, QuickNode) for production
- [ ] Enabled Supabase Realtime for tables: `messages`, `notifications`, `connections`
- [ ] Reviewed Supabase RLS policies to ensure proper access control
- [ ] Set up error monitoring (optional: Sentry, LogRocket)

---

## Post-Deployment

### 1. Enable Supabase Realtime

For WebSocket features to work:

1. Go to Supabase Dashboard → **Database** → **Replication**
2. Enable replication for these tables:
   - `messages`
   - `notifications`
   - `connections`
   - `team_messages`

### 2. Test Key Features

- [ ] Sign up with email/password
- [ ] Create a profile
- [ ] Post to the feed
- [ ] Send a message
- [ ] Check real-time updates work

### 3. Monitor Performance

Vercel provides automatic monitoring:
- **Analytics**: View page views, unique visitors
- **Speed Insights**: Track Core Web Vitals
- **Logs**: Check for errors in Functions logs

---

## Troubleshooting

### Build Fails

**Error:** `Module not found` or dependency issues
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### npm Warnings During Installation

**Common warnings you might see:**

1. **React peer dependency warnings** (qrcode.react, react-qr-reader)
   ```
   npm warn peer react@"^15.5.3 || ^16.0.0 || ^17.0.0" from qrcode.react@1.0.1
   ```
   - **Solution**: These are safe to ignore. The app uses React 19, but some Solana wallet dependencies expect older versions. The `--force` flag is used internally to resolve these.

2. **Deprecated Solana wallet adapters**
   ```
   npm warn deprecated @solana/wallet-adapter-slope@0.5.21
   npm warn deprecated @solana/wallet-adapter-glow@0.1.18
   ```
   - **Solution**: These warnings are expected. Some wallet adapters are deprecated but still functional. The app will work normally.

3. **Deprecated utility packages**
   ```
   npm warn deprecated rimraf@3.0.2
   npm warn deprecated glob@7.2.3
   ```
   - **Solution**: These are transitive dependencies. The warnings don't affect functionality.

**To suppress warnings during deployment:**
```bash
npm install --silent
```

### Environment Variables Not Working

- Make sure variables start with `NEXT_PUBLIC_` for client-side access
- Restart the build after adding new variables
- Check for typos in variable names

### Supabase Connection Issues

- Verify your API keys are correct
- Check if project is paused (free tier)
- Ensure RLS policies allow your operations
- Check Supabase logs for errors

### Real-time Not Working

- Enable replication in Supabase Dashboard
- Check browser console for WebSocket errors
- Verify Supabase Realtime is enabled for your plan

---

## Scaling Considerations

### When You Grow

1. **Upgrade Supabase Plan**
   - Free tier: 500MB database, 2GB bandwidth
   - Pro tier: 8GB database, 50GB bandwidth, better performance

2. **Use a Dedicated RPC**
   - Free Solana RPC is rate-limited
   - Consider [Helius](https://helius.dev) or [QuickNode](https://quicknode.com)

3. **Enable Caching**
   - Use Vercel Edge Network
   - Consider Redis for session storage

4. **Image CDN**
   - Use Supabase Storage for avatars/images
   - Or integrate Cloudinary/Imgix

---

## Need Help?

- **Vercel Docs**: [nextjs.org/learn/foundations/deploying-nextjs-apps](https://nextjs.org/learn/foundations/deploying-nextjs-apps)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **DevPump Issues**: [github.com/your-username/devpump/issues](https://github.com/Dip-Shiller/devpump/issues)

---

**Good luck with your deployment! 🚀**
