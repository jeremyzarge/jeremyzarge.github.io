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
