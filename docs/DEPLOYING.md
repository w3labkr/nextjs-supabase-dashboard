# Deploying

Deploy app to Vercel.

```shell
vercel deploy
```

(Optional) Deploying Static Exports `next.config.js`:

```javascript
module.exports = {
  output: 'export',
  exportTrailingSlash: true,
  assetPrefix: '/out',
}
```

Dependency packages in production for deployment on Vercel hosting.

```shell
npm install @vercel/analytics
```

(Optional) Vercel Speed Insights package

- [Limits and Pricing for Speed Insights](https://vercel.com/docs/speed-insights/limits-and-pricing)

```shell
npm install @vercel/speed-insights
```

(Optional) Image Optimization

- [Limits and Pricing for Image Optimization](https://vercel.com/docs/image-optimization/limits-and-pricing)

Usage image component

```javascript
import Image from 'next/image'

export default function Page() {
  return <Image />
}
```

Set image element rules in `.eslintrc.js`:

```javascript
module.exports = {
  rules: {
    '@next/next/no-img-element': 'warn',
  }
}
```

(Optional) Add cron jobs

- [https://vercel.com/docs/cron-jobs/quickstart]

```shell
vim vercel.json
{
  "crons": [
    {
      "path": "/api/cron/daily-reset-posts",
      "schedule": "0 0 * * *"
    }
  ]
}
```
