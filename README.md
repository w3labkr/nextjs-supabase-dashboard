# nextjs-ninja

NextJS app routing starter template for TypeScript that integrates Material-ui, i18next, and Firebase.

## Folder and file Structure

The folder and file structure is based on nextjs app router [Next.js Project Structur](https://nextjs.org/docs/getting-started/project-structure).

```txt
.
├── app/                        # App Router
│   └── [lng]/                  # Dynamic route segment
│   │   └── <page>/             # Route segment
│   │   │   └── _components/    # Opt folder and all child segments out of routing
│   │   ├── layout.ts           # Layout
│   │   └── page.ts             # Page
│   ├── i18n/
│   ├── icon.ts                 # Generated App Icon
│   ├── apple-icon.ts           # Generated Apple App Icon
│   ├── opengraph-image.ts      # Generated Open Graph image
│   ├── twitter-image.ts        # Generated Twitter image
│   ├── robots.ts               # Generated Robots file
│   └── sitemap.ts              # Generated Sitemap
├── components/                 # React components for filters, headers
├── configs/
├── contexts/
├── docs/
├── hooks/
├── lib/                        # Utility functions that aren't necessarily bound to React or Next.js
│   └── firebase/               # Firebase-specific code and Firebase configuration
├── public/                     # Static assets to be served
├── styles/
├── .env                        # Environment variables
├── package.json                # Project dependencies and scripts
├── middleware.ts               # Next.js request middleware
├── next.config.js              # Configuration file for Next.js
├── next-env.d.ts               # TypeScript declaration file for Next.js
└── tsconfig.json               # Configuration file for TypeScript
```

## Installation

- Would you like to use ESLint? … `Yes`
- Would you like to use Tailwind CSS? … `No`
- Would you like to use `src/` directory? … `No`
- Would you like to use App Router? (recommended) … `Yes`
- Would you like to customize the default import alias (@/\*)? … `No`

```shell
npx create-next-app@latest . --typescript
```

Keeping Server-only Code out of the Client Environment

```shell
npm install server-only
```

Set the current Node.js version.

```shell
node -v > .nvmrc
```

Material UI is an open-source React component library that implements Google's Material Design.

```shell
npm install @mui/material @emotion/react @emotion/styled
```

Next.js Integration

```shell
npm install @mui/material-nextjs @emotion/cache
```

To use the font Icon component or the prebuilt SVG Material Icons (such as those found in the icon demos),
you must first install the Material Icons font.

```shell
npm install @mui/icons-material
```

Firebase provides the tools and infrastructure you need to develop, grow, and earn money from your app.

```shell
npm install -g firebase-tools
npm install firebase firebase-admin
```

i18next is a very popular internationalization framework for browser or any other javascript environment (eg. Node.js, Deno).

```shell
npm install i18next react-i18next i18next-resources-to-backend accept-language
npm install react-cookie i18next-browser-languagedetector
```

React Hooks for form state management and validation (Web + React Native).

```shell
npm install zod react-hook-form @hookform/resolvers
# npm install yup formik
```

Generate RFC-compliant UUIDs in JavaScript

```shell
npm install uuid @types/uuid
```

Start the development server.

```shell
npm run dev
```

## Configuration

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

## Usage

After cleaning the directories and cache, install the dependency packages.

```shell
npm run reinstall
```

Find and fix problems in your JavaScript code.

```shell
npx eslint ./src
npx eslint --fix ./src
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
