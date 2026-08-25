# VitePotLock

JS App for tracking Shabbat meals with friends.

## Development

```bash
npm install    # Install dependencies
npm run dev    # Start development server
```

## Deployment to GitHub Pages

This app uses the `gh-pages` package to deploy to GitHub Pages.

### Deploy

```bash
npm run deploy
```

This command will:
1. Build the app (`npm run build`)
2. Push the `dist` folder to the `gh-pages` branch
3. GitHub Pages will serve the site from that branch

### First-time Setup

If this is your first time deploying, make sure GitHub Pages is configured:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Pages**
3. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** / **/ (root)**
4. Click **Save**

The site will be available at: https://jeremyzarge.github.io/

### Troubleshooting

If assets don't load correctly, you may need to set the base path in `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',  // Add this if deploying to a project page
});
```

## Checking logs

The app reports key events and failures to the Cloudflare Worker in `cloudflare-worker/`, which logs
them and stores them in a KV namespace for 30 days:

- `user_login`, `user_logout`
- `profile_created`, `profile_updated`
- `meal_created`, `meal_updated`, `meal_deleted`
- `meal_invite_sent`, `meal_invite_accepted`, `meal_invite_declined`
- `apartment_created`, `apartment_joined`
- `friend_request_sent`, `friend_request_accepted`
- `onetable_connected`, `onetable_disconnected`
- `sign_in_setup_failed` (error-level — a broken sign-in)

Search each name in `src/` to find exactly where it fires and what context it carries.

**Live, as they happen** (run from `cloudflare-worker/`):
```bash
npx wrangler tail
```

**Recent history** — reading requires `LOGS_READ_SECRET` (set via `npx wrangler secret put LOGS_READ_SECRET`
from `cloudflare-worker/`; keep this value out of git — it's deliberately never shipped to the browser,
unlike `NOTIFICATION_SECRET` in `src/notifications.ts`, which the app needs client-side and so isn't a
real secret):
```bash
curl "https://vitemeals-notifications.vitemeals.workers.dev/logs?limit=50" \
  -H "X-Logs-Secret: <your LOGS_READ_SECRET>"
```
