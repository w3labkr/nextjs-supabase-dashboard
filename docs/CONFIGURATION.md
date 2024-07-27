# CONFIGURATION

Edit `next.config.js`:

```javascript
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
}
```

To enable Turbopack. Edit `packages.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbo"
  }
}
```

Edit `packages.json`:

```json
{
  "scripts": {
    "clean:files": "rm -rf node_modules && rm -rf .next && rm -rf package-lock.json",
    "clean:cache": "npm cache clean --force && npm cache verify",
    "clean": "npm run clean:files && npm run clean:cache",
    "upgrade:latest": "npm run clean && npx npm-check-updates -u && npm install",
    "reinstall": "npm run clean && npm install",
  },
}
```

After cleaning the directories and cache, install the dependency packages.

```shell
npm run reinstall
```
