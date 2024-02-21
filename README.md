# NextJS Ninja

NextJS Ninja is a starter template for the [NextJS](https://nextjs.org/) 14 app router based on [shadcn-ui](https://ui.shadcn.com/).

Denpendency

- NextJS 14 + Typescript + Tailwind
- Shadcn UI (Radix UI)
- react-hook-form + zod
- react-i18next + zod-i18n-map
- Supabase OAuth with PKCE flow (@supabase/ssr)
- Supabase Email Auth with PKCE flow (@supabase/ssr)
- TODO: Supabase Auth Provider

## Screenshots

![screenshot](./screenshot.png)

## Folder and file Structure

The folder and file structure is based on nextjs app router [Next.js Project Structur](https://nextjs.org/docs/getting-started/project-structure).

```txt
.
├── app/                        # App Router
├── components/                 # React components for filters, headers
├── config/
├── context/
├── hooks/
├── lib/                        # Utility functions that aren't necessarily bound to React or Next.js
├── public/                     # Static assets to be served
│   └── [locales]/              # Internationalization
├── screenshots/                # Screenshots
├── sql/                        # Cloud functions
├── types/
├── utils/
└── package.json                # Project dependencies and scripts
```

## Installation

Prompts:

- Would you like to use TypeScript? `Yes`
- Would you like to use ESLint? `Yes`
- Would you like to use Tailwind CSS? `Yes`
- Would you like to use `src/` directory? `No`
- Would you like to use App Router? (recommended) `Yes`
- Would you like to customize the default import alias (@/*)? `No`
- What import alias would you like configured? `@/*`

```shell
npx create-next-app@latest . --typescript
```

React Hooks for Data Fetching

```shell
npm install swr
```

Set the current Node.js version.

```shell
node -v > .nvmrc
```

Start the development server.

```shell
npm run dev
```

## Configuration

Edit `next.config.js`:

```javascript
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
}
```

Edit `packages.json`:

```json
{
    "scripts": {
        "clean:dir": "rm -rf node_modules",
        "clean:cache": "npm cache clean --force",
        "clean": "npm run clean:dir && npm run clean:cache",
        "reinstall": "npm run clean && npm install"
    },
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

After cleaning the directories and cache, install the dependency packages.

```shell
npm run --force reinstall
```

## Tailwind CSS

Install Tailwind CSS

```shell
npm install --save-dev tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Using 'clsx' or 'classnames' with 'tailwind-merge'

```shell
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge
```

Tailwindcss plugin for hide scrollbar

```shell
npm install tailwind-scrollbar-hide
```

`utils/cn.ts`:

```typescript
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));
```

## Shadcn UI

Beautifully designed components that you can copy and paste into your apps. Accessible.

```shell
npx shadcn-ui@latest init
```

Add icon libraries

```shell
npm install lucide-react @radix-ui/react-icons
```

Dynamically load the lucide icon component.

```javascript
module.exports = {
  transpilePackages: ['lucide-react'],
}
```

Adding dark mode

```shell
npm install next-themes
```

Use the add command to add components and dependencies to your project.

```shell
npx shadcn-ui@latest add
npx shadcn-ui@latest add [component]
```

## Internationalization (i18n)

Internationalization for react done right. Using the i18next i18n ecosystem.

```shell
npm install react-i18next i18next i18next-http-backend
```

Useful for translating zod error messages.

```shell
npm install zod-i18n-map
```

## Schema Validation

React Hooks for form state management and validation (Web + React Native).

```shell
npm install react-hook-form 
npm install zod @hookform/resolvers
```

## Supabase Cloud Functions

Run the SQL code in `SQL Editor > New Query`.

## Supabase Auth

Install Supabase packages

```shell
npm install @supabase/supabase-js @supabase/ssr
```

Set environment variables. Edit `.env.local`:

```txt
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

Reference

- [Setting up Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Auth rate limits](https://supabase.com/docs/guides/platform/going-into-prod#auth-rate-limits)

## Firebase Auth

Firebase provides the tools and infrastructure you need to develop, grow, and earn money from your app.

```shell
# npm ERR! Could not resolve dependency:
# npm ERR! peer firebase-admin@"^11.0.1" from firebase-frameworks@0.11.1
npm install -g firebase-tools
npm install firebase firebase-admin@11.11.1
```

Prompts:

- Realtime Database: Configure a security rules file for Realtime Database and (optionally) provision default instance `No`
- Firestore: Configure security rules and indexes files for Firestore `Yes`
- Functions: Configure a Cloud Functions directory and its files `No`
- Hosting: Configure files for Firebase Hosting and (optionally) Set up GitHub Action deploys `No`
- Hosting: Set up GitHub Action deploys `No`
- Storage: Configure a security rules file for Cloud Storage `Yes`
- Emulators: Set up local emulators for Firebase products `Yes`
- Remote Config: Configure a template file for Remote Config `No`
- Extensions: Set up an empty Extensions manifest `No`
- Frameworks: Get started with Frameworks projects. `No`

```shell
firebase init
```

Create a new project alias.

```shell
firebase list
firebase use --add
```

Initialize the Firebase emulator.

```shell
# hosting: Port 5000 is not open on localhost (127.0.0.1,::1), could not start Hosting Emulator
# Port 5000 and 7000 are taken by airplay on MacOS Monterey.
firebase init emulators
```

For Mac/Linux, use the Terminal/Shell to find the Process ID (PID), then kill the process.

```shell
# Error: Could not start Hosting Emulator, port taken.
lsof -ti tcp:5000 | xargs kill -9 && firebase emulators:start
```

Start the firebase emulator.

```shell
firebase emulators:start
```

Set the expiration of a preview channel.

```shell
firebase init hosting
firebase hosting:channel:deploy preview --expires 1h
```

Start firebase deployment.

```shell
firebase deploy
```

## Utils

Share target browsers between different front-end tools, like Autoprefixer, Stylelint and babel-preset-env

```shell
npm install browserslist
```

A collection of essential TypeScript types

```shell
npm install type-fest
```

Svg react icons of popular icon packs

```shell
npm install react-icons
```

A modern JavaScript utility library delivering modularity, performance, & extras.

```shell
npm install lodash @types/lodash
```

Generate RFC-compliant UUIDs in JavaScript

```shell
npm install uuid @types/uuid
```

## Useful Utils

Get or Set the HTTP response code

```javascript
import { httpResponseCode } from '@/utils/server'

httpResponseCode(401)

// Same as below
NextResponse.json({ "status": 401, "statusText": "Unauthorized", "message": "The client must authenticate itself to get the requested response." }, { status: 401 })
```

## ESLint

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.

```shell
npm install --save-dev eslint eslint-plugin-react eslint-plugin-react-hooks
npm install --save-dev @next/eslint-plugin-next
npm install --save-dev eslint-plugin-import eslint-import-resolver-typescript
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin 
npm install --save-dev prettier eslint-plugin-prettier eslint-config-prettier
npm install --save-dev eslint-plugin-tailwindcss prettier-plugin-tailwindcss
```

Edit `next.config.js`:

```javascript
module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}
```

Find and fix problems in your JavaScript code.

```shell
npx eslint ./app
npx eslint --fix ./{app,components,context,hooks,lib,types,utils}
```

To format a file in-place

```shell
npx prettier --check "./app/**/*.{ts,tsx}"
npx prettier --write "./{app,components,context,hooks,lib,types,utils}/**/*.{ts,tsx}"
```

## Deploying

Dependency packages in production for deployment on Vercel hosting.

```shell
npm install @vercel/analytics
```

Deploy app to Vercel

```shell
vercel deploy
```

Deploying Static Exports `next.config.js`:

```javascript
module.exports = {
  output: 'export',
  exportTrailingSlash: true,
  assetPrefix: '/out',
}
```

## Troubleshooting

...
