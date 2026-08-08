# D&D Character Sheets

A collection of D&D 5e character sheets built as a web app with **React Router 8** and **React 19**. Each character is a route; routes are auto-discovered from `app/routes/`.

## Sections

- **Characters** (`/characters`) — personal character sheets (Adrik, Azamat, Bender, Meg, Milo)
- **Critical Role** (`/critical-role`) — Critical Role character sheets
- **Classes** (`/classes`) — class reference pages
- **General Info** (`/general-info`) — game reference info

## Development

```sh
npm install          # install dependencies
npm run dev          # dev server on port 3000
npm run build        # production build
npm start            # serve production build
```

## Verification

```sh
npm run format       # Prettier
npm run check        # typegen + TypeScript check
npm test             # unit tests (Vitest)
npm run test:e2e     # e2e tests (Playwright)
```

## Reference data

- `5etools/` — local copy of 5etools D&D 5e data; query it with `npm run 5etools`
- `critical-role/` — Critical Role MediaWiki XML; extract with `npm run cr:extract`, download with `npm run cr:download`
