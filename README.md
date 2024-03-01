# Chat Web Frontend

## Introduction

A Mini Project from BIGIO.ID that interacts between the server and client using [socket.io](https://socket.io/)

This is dashboard chat dark mode.

<image src="./public/dark-chat.png" />

This is dashboard chat light mode.

<image src="./public/light-chat.png" />

## Table of Contents

- [Introduction](#introduction)
- [Table of Contents](#table-of-contents)
- [How to Run](#how-to-run)
- [Libraries](#libraries)
- [Project Structure](#project-structure)

## How to Run

```bash
npm install
npm run dev
# or
yarn install
yarn dev
# or
pnpm install
pnpm dev
# or
bun install
bun dev
```

Port [http://localhost:3000](http://localhost:3000) for the socket.io to interact with backend and frontend.

Open [http://localhost:3002](http://localhost:3002) with your browser to see the result.

You can start editing the page by modifying `/app/page.tsx`. The page auto-updates as you edit the file.

## Libraries

- nextui
- autoprefixer
- clsx
- eslint
- framer-motion
- next
- next-theme
- pg
- react
- react-icons
- react-query
- socket.io-client
- tailwindcss
- typescript

## Project Structure

```basb
├─app
│  ├───auth
│  │   ├───login
│  │   │   └───page.tsx
│  │   └───register
│  │   │   └───page.tsx
│  ├───dashboard
│  │   └───page.tsx
│  └──README.md
├───components
├───config
├───hooks
└───types
```

## Contributors

[rizkyhaksono](https://github.com/rizkyhaksono)

## LICENSE

[MIT LICENSE](./LICENSE)
