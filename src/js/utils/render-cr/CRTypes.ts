/**
 * Type definitions for Critical Role character data extracted from MediaWiki XML exports.
 */

/**
 * A main player character extracted from the Critical Role wiki.
 */
export interface Character {
  name: string;
  rawWikitext: string;
}

/**
 * MediaWiki page structure from XML export.
 * @internal
 */
export interface MediaWikiPage {
  title?: string[];
  revision?: Array<{
    text?: Array<{ _: string } | string>;
  }>;
}

/**
 * Root structure of MediaWiki XML export.
 * @internal
 */
export interface MediaWikiExport {
  mediawiki?: {
    page?: MediaWikiPage[];
  };
}
