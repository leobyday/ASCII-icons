/** A signed distance function: distance from (x, y, z) to the model's surface. */
export type SDF = (x: number, y: number, z: number) => number;

export interface RenderOptions {
  /** Characters per line. Default 50. */
  cols?: number;
  /** Lines. Default 30. */
  rows?: number;
  /** Turn around the vertical axis, in radians. Default -0.35. */
  angle?: number;
  /** Tip toward the viewer, in radians. Default 0.22. */
  tilt?: number;
  /** Character width / line height. Default 0.6. */
  cellAspect?: number;
}

/** The shading characters, lightest to darkest: ".:-=+*#%@". */
export const RAMP: string;
/** Every registered model, by name. Populated by `require("ascii-3d-icons/models")`. */
export const models: Readonly<Record<string, SDF>>;
/** Add or replace models. */
export function register(models: Record<string, SDF>): void;
/** Render a registered model (by name) or an SDF to `rows` lines of `cols` characters. */
export function render(model: string | SDF, options?: RenderOptions): string;

export const sdf: {
  union(...d: number[]): number;
  intersect(...d: number[]): number;
  subtract(a: number, b: number): number;
  smoothUnion(a: number, b: number, k: number): number;
  rotate(x: number, y: number, angle: number): [number, number];
  sphere(x: number, y: number, z: number, r: number): number;
  ellipsoid(x: number, y: number, z: number, a: number, b: number, c: number): number;
  roundBox(x: number, y: number, z: number, bx: number, by: number, bz: number, r: number): number;
  cylinderZ(x: number, y: number, z: number, r: number, h: number): number;
  cylinderY(x: number, y: number, z: number, r: number, h: number): number;
  torusZ(x: number, y: number, z: number, R: number, r: number): number;
  torusY(x: number, y: number, z: number, R: number, r: number): number;
  capsule(x: number, y: number, z: number, ax: number, ay: number, bx: number, by: number, r: number): number;
  triangle(px: number, py: number, r: number): number;
  extrude(d: number, z: number, h: number): number;
  octahedron(x: number, y: number, z: number, s: number): number;
};
