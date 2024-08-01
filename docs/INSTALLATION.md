# INSTALLATION

## Table of contents

- [INSTALLATION](#installation)
  - [Table of contents](#table-of-contents)
  - [Packages](#packages)
    - [Next.js](#nextjs)
    - [Supabase CLI](#supabase-cli)
    - [Supabase Auth](#supabase-auth)
    - [Tailwind CSS](#tailwind-css)
    - [Shadcn UI](#shadcn-ui)
    - [Shadcn UI - Time Picker](#shadcn-ui---time-picker)
    - [Shadcn UI - Emblor](#shadcn-ui---emblor)
    - [Internationalization (i18n)](#internationalization-i18n)
    - [Schema Validation](#schema-validation)
    - [Redux Toolkit](#redux-toolkit)
    - [SWR](#swr)
    - [PWA (Progressive Web Apps)](#pwa-progressive-web-apps)
    - [Nodemailer](#nodemailer)
    - [Ckeditor 5](#ckeditor-5)
  - [Utilities](#utilities)

## Packages

### Next.js

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

When creating a database type in `supabase.com`

- `Api Docs` > `Introduction` > `Generating Types`

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

Adding dark mode.

```shell
npm install next-themes
```

Use the add command to add components and dependencies to your project.

```shell
npx shadcn-ui@latest add
```

Hides content from the screen in an accessible way.

```shell
npm install @radix-ui/react-visually-hidden
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

Custom [trans component](https://react.i18next.com/latest/trans-component) rendering for the client side.

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

### SWR

React Hooks for Data Fetching.

```shell
npm install swr
```

### PWA (Progressive Web Apps)

Zero config PWA plugin for Next.js, with workbox.

```shell
npm install next-pwa
```

- [next-pwa](https://github.com/shadowwalker/next-pwa)

### Nodemailer

Send e-mails with Node.JS.

```shell
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Ckeditor 5

Install packages

```shell
npm install ckeditor5 @ckeditor/ckeditor5-react
```

## Utilities

Share target browsers between different front-end tools, like Autoprefixer, Stylelint and babel-preset-env.

```shell
npm install browserslist
```

A small, fast and rich-API browser/platform/engine detector for both browser and node.

```shell
npm install bowser
```

A collection of essential TypeScript types.

```shell
npm install type-fest
```

React hook library, ready to use, written in Typescript.

```shell
npm install usehooks-ts
```

A modern JavaScript utility library delivering modularity, performance, & extras.

```shell
npm install lodash @types/lodash
```

Day.js 2kB immutable date-time library alternative to Moment.js with the same modern API.

```shell
npm install dayjs
```

Flatten/unflatten nested Javascript objects.

```shell
npm install flat
```

JsonWebToken implementation for node.js.

```shell
npm install jsonwebtoken @types/jsonwebtoken
```

Slugifies a string

```shell
npm install slugify
```

Svg react icons of popular icon packs.

```shell
npm install react-icons
```

Vector (*.svg) country flag icons in 3:2 aspect ratio.

```shell
npm install country-flag-icons
```

Generate massive amounts of fake data in the browser and node.js.

```shell
npm install @faker-js/faker
```
