# General notes

- This is a D&D Character sheet project using Astro.js with React components
- Each character is an Astro **page**

# Verification

You MUST run verification when you are done

- Run formatter with `npm run format`
- Run type check with `npm run check`
- Run build with `npm run build`
- Run tests with `npm test`
- Run e2e tests with `npm run test:e2e`

# React notes
- Use idiomatic component declarations to be as consistent as possible with Astro: 
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
This project has a clone of the 5etools data in `5etools/`
YOU MUST use prefer the local data when question related to D&D 5e arise
@.agents/using-5etools.md