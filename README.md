# nextjs-ninja

Nextjs-Ninja is a TypeScript [Nextjs](https://nextjs.org/) template for [shadcn/ui](https://ui.shadcn.com/) based app router using [tailwindcss](https://tailwindcss.com/), [next-intl](https://next-intl-docs.vercel.app/) and [next-auth](https://next-auth.js.org/).

## Folder and file Structure

The folder and file structure is based on nextjs app router [Next.js Project Structur](https://nextjs.org/docs/getting-started/project-structure).

```txt
.
├── app/                        # App Router
│   ├── [locale]/               # Dynamic route segment
│   │   ├── <page>/             # Route segment
│   │   ├── layout.js           # Layout
│   │   └── page.js             # Page
│   ├── icon.js                 # Generated App Icon
│   ├── apple-icon.js           # Generated Apple App Icon
│   ├── opengraph-image.js      # Generated Open Graph image
│   ├── twitter-image.js        # Generated Twitter image
│   ├── robots.js               # Generated Robots file
│   └── sitemap.js              # Generated Sitemap
├── components/                 # React components for filters, headers
├── config/
├── content/                    # Content Layer
├── hooks/
├── lib/                        # Utility functions that aren't necessarily bound to React or Next.js
│   └── firebase/               # Firebase-specific code and Firebase configuration
├── locales/
│   └── <locale>/
├── public/                     # Static assets to be served
├── styles/
├── .env                        # Environment variables
├── package.json                # Project dependencies and scripts
├── middleware.js               # Next.js request middleware
└── next.config.js              # Configuration file for Next.js
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

Keeping Server-only Code out of the Client Environment

```shell
npm install server-only
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

After cleaning the directories and cache, install the dependency packages.

```shell
npm run --force reinstall
```

## Shadcn UI

Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.

```shell
npx shadcn-ui@latest init
```

A crisp set of 15×15 icons designed by the @workos team.

```shell
npm install @radix-ui/react-icons
```

A lightweight carousel library with fluid motion and great swipe precision.

```shell
npm install embla-carousel-react
```

Use the add command to add components and dependencies to your project.

```shell
npx shadcn-ui@latest add
npx shadcn-ui@latest add [component]
```

Adding dark mode

```shell
npm install next-themes
```

## Tailwind CSS

Install Tailwind CSS

```shell
npm install --save-dev tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then add it to the very end of your plugin list in your PostCSS configuration:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

A tiny (239B) utility for constructing `className` strings conditionally.

```shell
npm install clsx
```

Merge Tailwind CSS classes without style conflicts

```shell
npm install tailwind-merge
```

Using 'clsx' or 'classnames' with 'tailwind-merge'

```typescript
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));
```

## Internationalization

Internationalization (i18n) for Next.js that gets out of your way.

```shell
npm install next-intl rtl-detect @types/rtl-detect
```

Getting started

- `next.config.js`: Set up the plugin which creates an alias to import your i18n configuration into Server Components.
- `i18n.ts`: Creates a configuration once per request.
- `middleware.ts`: The middleware matches a locale for the request and handles redirects and rewrites accordingly.
- `next-intl.config.ts`
- `navigation.ts`

## Schema Validation

React Hooks for form state management and validation (Web + React Native).

```shell
npm install react-hook-form 
npm install zod @hookform/resolvers
```

## Authentication

Authentication for the Web.

```shell
npm install next-auth
```

Generate next auth secret

```shell
openssl rand -base64 32
```

## Firebase Auth

Firebase provides the tools and infrastructure you need to develop, grow, and earn money from your app.

```shell
npm install -g firebase-tools
npm install firebase firebase-admin
```

Prompts:

- Realtime Database: Configure a security rules file for Realtime Database and (optionally) provision default instance `No`
- Firestore: Configure security rules and indexes files for Firestore `Yes`
- Functions: Configure a Cloud Functions directory and its files `No`
- Hosting: Configure files for Firebase Hosting and (optionally) Set up GitHub Action deploys `Yes`
- Hosting: Set up GitHub Action deploys `No`
- Storage: Configure a security rules file for Cloud Storage `Yes`
- Emulators: Set up local emulators for Firebase products `Yes`
- Remote Config: Configure a template file for Remote Config `No`
- Extensions: Set up an empty Extensions manifest `No`
- Frameworks: Get started with Frameworks projects. `No`

```shell
firebase init
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

## Markdown and MDX

Install packages needed to render MDX:

```shell
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

Content Layer

```shell
npm install contentlayer next-contentlayer date-fns
```

Could not resolve dependency: Edit `package.json`

```json
{
    "overrides": {
        "next-contentlayer": {
        "next": "$next"
        }
    }
}
```

Transform markdown into HTML:

```shell
npm install remark-gfm rehype-slug rehype-autolink-headings
npm install rehype rehype-pretty-code@0.10.2 shiki
```

## Utils

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

## ESLint

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.

Installation:

```shell
npm install --save-dev eslint @next/eslint-plugin-next
npm install --save-dev eslint-plugin-import eslint-import-resolver-typescript
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin 
npm install --save-dev prettier eslint-plugin-prettier eslint-config-prettier
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
npx eslint --fix ./components
npx eslint --fix ./{app,components,hooks,lib}
```

## Troubleshooting

- `./components/icons.tsx`  
Type error: '"lucide-react"' has no exported member named 'Icon'. Did you mean 'XIcon'?

```typescript
// import { LucideProps, Moon, SunMedium, type Icon as LucideIcon } from 'lucide-react';
import { LucideProps, Moon, SunMedium, type LucideIcon } from 'lucide-react';
```

- `./components/ui/carousel.tsx`  
Type error: '"embla-carousel-react"' has no exported member named 'EmblaCarouselType'. Did you mean 'UseEmblaCarouselType'?

```typescript

```

- `./contentlayer.config.ts`

Type error: downgrade 0.12.3 to 0.10.2
