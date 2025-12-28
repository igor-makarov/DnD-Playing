# General notes

- This is a D&D Character sheet project using React Router 7 with React components
- Each character is an React Router **route**
- Prefer validating HTML output with `Read` and `Search` tools

# Verification

You MUST run verification when you are done

- Run formatter with `npm run format`
- Run type check with `npm run check`
- Run build with `npm run build`
- Run tests with `npm test`
- Run e2e tests with `npm run test:e2e`

# React notes
- Use idiomatic component declarations to be as consistent as possible with React: 
```typescript 
import React from "react";
interface Props { 
  // properties
} 
export default function ComponentName({ ... }: Props) {
  // impl
}
```

- `useEffect` should not be the first go-to - YOU MUST look for other, better structured alternatives
- `useStore` to interact with nanostores - custom impl in `@/js/hooks/useStore`

# 5etools reference
This project has a copy of the 5etools data in `5etools/`
- YOU MUST use prefer the local data when question related to D&D 5e arise
- Guide: @.agents/using-5etools.md

# Critical Role data
- XML sources: `critical-role/`
- Extract main character data from MediaWiki XML: `npm run cr:extract`
- Download main character data XML from MediaWiki: `npm run cr:download`
- Get names: `npm run cr:extract -- <xml-file> [--names]`
- Get character info: `npm run cr:extract -- <xml-file> [--name <name>]`
- IMPORTANT: DO NOT truncate CR tool output! This will result in incomplete character info
