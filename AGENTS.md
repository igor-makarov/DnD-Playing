# General notes

- This is a D&D Character sheet project using Astro.js with React components
- Each character is an Astro **page**

# Verification

You MUST run verification when you are done

- Run formatter with `npm run format`
- Run type check with `npm run check`
- Run build with `npm run build`
- Run tests with `npm test`

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

- `useEffect` should not be the first go-to - look for other, better structured alternatives