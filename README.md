# Akhil Vishnubhotla — Personal Website

Personal portfolio built with React, Vite, and CSS. Includes an interactive laptop navigation, experience and projects, and a MetaFloor engineering case study with a demo video and SVG architecture diagrams.

## Local development

```sh
npm ci
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Deploy on Vercel

Import this repository into Vercel. Use the Vite preset, build command `npm run build`, and output directory `dist`. The included `vercel.json` supports direct links to `/experience/metafloor`.

## Content

- `src/data/portfolio.js`: biography, experience, projects, and case study
- `src/data/reflection.js`: reflection
- `src/main.jsx`: pages and components
- `src/style.css`: site styling
- `public/architecture/`: diagrams
- `public/videos/metafloor-demo.mp4`: demo video

Dependencies, generated builds, local hosting metadata, and scratch files are excluded from version control.
