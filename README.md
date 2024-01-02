# nextjs-ninja

NextJS app routing starter template that integrates Material-UI, i18next, and Firebase Auth.

## Folder and file Structure

The folder and file structure is based on nextjs app router [Next.js Project Structur](https://nextjs.org/docs/getting-started/project-structure).

```txt
.
├── app/                        # App Router
│   └── [lng]/                  # Dynamic route segment
│   │   └── <page>/             # Route segment
│   │   │   └── _components/    # Opt folder and all child segments out of routing
│   │   ├── layout.js           # Layout
│   │   └── page.js             # Page
│   ├── i18n/
│   ├── icon.js                 # Generated App Icon
│   ├── apple-icon.js           # Generated Apple App Icon
│   ├── opengraph-image.js      # Generated Open Graph image
│   ├── twitter-image.js        # Generated Twitter image
│   ├── robots.js               # Generated Robots file
│   └── sitemap.js              # Generated Sitemap
├── components/                 # React components for filters, headers
├── configs/
├── contexts/
├── hooks/
├── lib/                        # Utility functions that aren't necessarily bound to React or Next.js
│   └── firebase/               # Firebase-specific code and Firebase configuration
├── public/                     # Static assets to be served
├── styles/
├── .env                        # Environment variables
├── package.json                # Project dependencies and scripts
├── middleware.js               # Next.js request middleware
└── next.config.js              # Configuration file for Next.js
```

## Installation

- Would you like to use TypeScript? … `No`
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

After cleaning the directories and cache, install the dependency packages.

```shell
npm run reinstall
```

## Material UI

Material UI is an open-source React component library that implements Google's Material Design.

```shell
npm install @mui/material @emotion/react @emotion/styled @mui/lab
```

To use the font Icon component or the prebuilt SVG Material Icons (such as those found in the icon demos),
you must first install the Material Icons font.

```shell
npm install @mui/icons-material
```

Next.js Integration

```shell
npm install @mui/material-nextjs @emotion/cache
```

## i18next

i18next is a very popular internationalization framework for browser or any other javascript environment (eg. Node.js, Deno).

```shell
npm install i18next react-i18next i18next-resources-to-backend accept-language
npm install react-cookie i18next-browser-languagedetector
```

## State Management

React Hooks for form state management and validation (Web + React Native).

```shell
npm install zod react-hook-form @hookform/resolvers
# npm install yup formik
```

## Utils

Runtime type checking for React props and similar objects

```shell
npm install prop-types
```

Generate RFC-compliant UUIDs in JavaScript

```shell
npm install uuid
```

## ESLint

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.

Installation:

```shell
npm install --save-dev eslint eslint-plugin-import
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks @next/eslint-plugin-next
npm install --save-dev prettier eslint-plugin-prettier eslint-config-prettier
```

Edit `next.config.js`:

```javascript
module.exports = {
  eslint: {
    dirs: ['app', 'components', 'hooks', 'lib'],
  },
}
```

Find and fix problems in your JavaScript code.

```shell
npx eslint ./app
npx eslint --fix ./app
```

## Firebase Auth

Firebase provides the tools and infrastructure you need to develop, grow, and earn money from your app.

```shell
npm install -g firebase-tools
npm install firebase firebase-admin
```

- Hosting: Configure files for Firebase Hosting and (optionally) Set up GitHub Action deploys
- Detected an existing Next.js codebase in the current directory, should we use this? `Yes`
- Set up automatic builds and deploys with Github? `No`

```shell
firebase init
```

Edit `firebase.json`:

```json
{
    "firestore": {
        "rules": "firestore.rules",
        "indexes": "firestore.indexes.json"
    },
    "storage": {
        "rules": "storage.rules"
    }
}
```

Edit `firestore.indexes.json`

```json
{
    "indexes": [],
    "fieldOverrides": []
}
```

Edit `firestore.rules`:

```javascript
service cloud.firestore {
    allow read, write: if true;
}
```

Edit `storage.rules`:

```javascript
service firebase.storage {
    allow read, write: if true;
}
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

## Troubleshooting

(...)
