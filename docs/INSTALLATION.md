# INSTALLATION

## Table of contents

- [INSTALLATION](#installation)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation-1)
    - [SWR](#swr)
    - [Tailwind CSS](#tailwind-css)
    - [Shadcn UI](#shadcn-ui)
    - [Shadcn UI - Time Picker](#shadcn-ui---time-picker)
    - [Shadcn UI - Emblor](#shadcn-ui---emblor)
    - [Internationalization (i18n)](#internationalization-i18n)
    - [Schema Validation](#schema-validation)
    - [Redux Toolkit](#redux-toolkit)
    - [Supabase Cloud Functions](#supabase-cloud-functions)
    - [Supabase CLI](#supabase-cli)
    - [Supabase Auth](#supabase-auth)
    - [PWA (Progressive Web Apps)](#pwa-progressive-web-apps)
    - [ESLint](#eslint)
    - [CKEditor 5](#ckeditor-5)
  - [Utilities](#utilities)
  - [Reference](#reference)

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

Set the current Node.js version.

```shell
node -v > .nvmrc
```

Start the development server.

```shell
npm run dev
```

### SWR

React Hooks for Data Fetching.

```shell
npm install swr
```

### Tailwind CSS

Install Tailwind CSS.

```shell
npm install --save-dev tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Using 'clsx' or 'classnames' with 'tailwind-merge'.

```shell
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge
```

Tailwindcss plugin for hide scrollbar.

```shell
npm install tailwind-scrollbar-hide
```

`lib/utils/cn.ts`:

```typescript
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));
```

### Shadcn UI

Beautifully designed components that you can copy and paste into your apps. Accessible.

```shell
npx shadcn-ui@latest init
```

Add icon libraries.

```shell
npm install lucide-react @radix-ui/react-icons
```

(Optional) If you are loading the lucide icon component dynamically, edit `next.config.js`.

```javascript
module.exports = {
  transpilePackages: ['lucide-react'],
}
```

Adding dark mode.

```shell
npm install next-themes
```

Use the add command to add components and dependencies to your project.

```shell
npx shadcn-ui@latest add
npx shadcn-ui@latest add [component]
```

The configuration for Shadcn UI is `components.json`.

### Shadcn UI - Time Picker

A simple TimePicker for your Shadcn UI project.

- <https://github.com/openstatusHQ/time-picker>

### Shadcn UI - Emblor

A fully-featured tag input component built with shadcn/ui.

```shell
npm install emblor
```

- <https://github.com/JaleelB/emblor>

### Internationalization (i18n)

Internationalization for react done right. Using the i18next i18n ecosystem.

```shell
npm install react-i18next i18next i18next-http-backend
```

[Trans component](https://react.i18next.com/latest/trans-component) rendering for the client side.

```javascript
import { useTrans } from '@/hooks/i18next'

const { trans } = useTrans()

export default function App() {
  return (
    <div>
    {trans('key', { 
      components: {
        i: <i />,
        link1: <Link href="#" />,
      },
      values: { what: 'world' }
    })}
    </div>
  )
}

// translation.json
// { "key": "hello <i>beautiful</i> <link1>{{what}}</link1>" }
```

The configuration for i18next is `i18next.config.ts`.

### Schema Validation

Performant, flexible and extensible forms library for React Hooks.

```shell
npm install react-hook-form 
```

TypeScript-first schema validation with static type inference.

```shell
npm install zod @hookform/resolvers
```

Useful for translating zod error messages.

```shell
npm install zod-i18n-map
```

### Redux Toolkit

The official, opinionated, batteries-included toolset for efficient Redux development.

```shell
npm install @reduxjs/toolkit react-redux
```

persist and rehydrate a redux store.

```shell
npm install redux-persist
```

### Supabase Cloud Functions

Run the SQL code in `SQL Editor > New Query`.

Generating Database Types.

- `Api Docs` > `Introduction` > `Generating Types`
- [Generating types using Supabase CLI](https://supabase.com/docs/guides/api/rest/generating-types)

### Supabase CLI

Supabase CLI. Manage postgres migrations, run Supabase locally, deploy edge functions. Postgres backups. Generating types from your database schema.

```shell
npm install supabase --save-dev
```

Updating the Supabase CLI.

```shell
npm update supabase --save-dev
```

Login with your Personal Access Token:

```shell
npx supabase login
```

Generate types without init.

```shell
npx supabase gen types typescript --project-id "YOUR_PROJECT_ID" --schema public > types/supabase.ts
```

Generate types with init.

```shell
npx supabase init
npx supabase link --project-ref YOUR_PROJECT_ID
npx supabase gen types typescript --linked > types/supabase.ts
```

Edit `package.json`:

```json
{
  "scripts": {
    "gen-types": "supabase gen types --lang=typescript --linked > types/supabase.ts"
  }
}
```

Generating Types.

```shell
npm run gen-types
```

### Supabase Auth

Install Supabase packages.

```shell
npm install @supabase/supabase-js @supabase/ssr
```

Set environment variables. Edit `.env.local`:

```txt
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

- [Setting up Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Auth rate limits](https://supabase.com/docs/guides/platform/going-into-prod#auth-rate-limits)

### PWA (Progressive Web Apps)

Zero config PWA plugin for Next.js, with workbox.

```shell
npm install next-pwa
```

- [next-pwa](https://github.com/shadowwalker/next-pwa)

### ESLint

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

To format a file in-place.

```shell
npx prettier --check "./app/**/*.{ts,tsx}"
npx prettier --write "./{app,components,context,hooks,lib,types,utils}/**/*.{ts,tsx}"
```

### CKEditor 5

Powerful rich text editor framework with a modular architecture, modern integrations, and features like collaborative editing.

Download the files from [Online Builder](https://ckeditor.com/ckeditor-5/online-builder/) and unzip them into the ckeditor5 folder. However, exclude the [Watchdog](https://ckeditor.com/docs/ckeditor5/latest/installation/integrations/react.html#using-the-ckeditor-5-online-builder) feature.

And run the script below:

```shell
npm install file:./ckeditor5
npm install @ckeditor/ckeditor5-react@6.2.0
```

Upgrade ckeditor5-custom-build.

```shell
cd ./ckeditor5 && npx npm-check-updates -u
cd .. && npm install file:./ckeditor5
```

- [Integrate CKEditor 5 with Next.js](https://ckeditor.com/docs/ckeditor5/latest/installation/integrations/next-js.html)

## Utilities

Share target browsers between different front-end tools, like Autoprefixer, Stylelint and babel-preset-env.

```shell
npm install browserslist
```

A collection of essential TypeScript types.

```shell
npm install type-fest
```

Svg react icons of popular icon packs.

```shell
npm install react-icons
```

A modern JavaScript utility library delivering modularity, performance, & extras.

```shell
npm install lodash @types/lodash
```

Day.js 2kB immutable date-time library alternative to Moment.js with the same modern API.

```shell
npm install dayjs
```

Send e-mails with Node.JS.

```shell
npm install nodemailer
npm install --save-dev @types/nodemailer
```

JsonWebToken implementation for node.js.

```shell
npm install jsonwebtoken @types/jsonwebtoken
```

Slugifies a string

```shell
npm install slugify
```

Generate massive amounts of fake data in the browser and node.js.

```shell
npm install @faker-js/faker
```

Vector (*.svg) country flag icons in 3:2 aspect ratio.

```shell
npm install country-flag-icons
```

A small, fast and rich-API browser/platform/engine detector for both browser and node.

```shell
npm install bowser
```

Flatten/unflatten nested Javascript objects.

```shell
npm install flat
```

## Reference

- [shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- [shadcn-ui/taxonomy](https://github.com/shadcn-ui/taxonomy)
- [nextjs-slack-clone](https://github.com/supabase/supabase/tree/master/examples/slack-clone/nextjs-slack-clone)
- [nextjs-subscription-payments](https://github.com/vercel/nextjs-subscription-payments)
