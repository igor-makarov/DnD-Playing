import type { Character } from "./CRTypes";

/**
 * Render a Critical Role character to markdown format.
 *
 * @param character - The character data
 * @returns Markdown-formatted string with character name as heading and raw wikitext
 */
export default function renderMarkdown(character: Character): string {
  return `# ${character.name}\n\n${character.rawWikitext}`;
}
