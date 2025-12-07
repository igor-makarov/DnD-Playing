# 5etools Data Reference

## Location
`5etools/data/` - 495 JSON files, 106MB, D&D 5e reference data

## Structure
- **Top-level JSON files**: Core game data (races.json, feats.json, items.json, etc.)
- **`books.json`, `adventures.json`**: Metadata and references to sourcebook content
- **`class/`**: class-{name}.json files (class-wizard.json, class-fighter.json, etc.)
- **`spells/`**: spells-{source}.json files organized by sourcebook
- **`bestiary/`**: bestiary-{source}.json organized by sourcebook
- **`fluff-*.json`**: Lore/flavor text (fluff-races.json, fluff-spells-*.json)
- **`adventure/`, `book/`**: Full content from sourcebooks
- **`generated/`**: Pre-computed data

## Key Fields
- `name`, `source` (PHB/XGE/TCE/MM/etc), `page`
- `entries` - description array
- `srd` - free SRD content flag

