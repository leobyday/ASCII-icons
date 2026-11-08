export interface SVGOptions {
  /** Width and height in px. Default 1024. */
  size?: number;
  /** Accessible title; also seeds element ids so several icons can share a page. */
  title?: string;
}
export interface HTMLOptions {
  /** Tile width and height in px. Default 180. */
  size?: number;
  /** Accessible label for the tile. */
  title?: string;
}
/** Wrap rendered art in the keycap tile as an SVG document with editable text. */
export function toSVG(art: string, options?: SVGOptions): string;
/** Wrap rendered art in the keycap tile as a self-contained HTML fragment. */
export function toHTML(art: string, options?: HTMLOptions): string;
