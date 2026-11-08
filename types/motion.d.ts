/** Default loop length in seconds (13.2). Periods that divide it loop without a seam. */
export const LOOP: number;
/** Resting view angle for every icon (-0.35 rad). */
export const REST_ANGLE: number;
/** Center of the sway (-0.2 rad). */
export const SWAY_CENTER: number;
/** Angular frequency that repeats exactly `cycles` times per loop. */
export function loopFrequency(cycles: number, loop?: number): number;
/** Side-to-side angle at time `t` seconds. */
export function sway(t: number, options?: { amplitude?: number; cycles?: number; phase?: number; loop?: number }): number;
/** One full eased turn over progress 0..1, starting and ending at rest. */
export function spin(progress: number): number;
/** Art resolving out of character noise: progress 0 is noise, 1 is the finished art. */
export function reveal(art: string, progress: number, options?: { seed?: number; frame?: number }): string;
/** Ease-out curve for a reveal, for u = 0..1 of its duration. */
export function revealEase(u: number): number;
/** Smoothstep. */
export function smooth(p: number): number;
/** Deterministic noise in [0, 1). */
export function hash(a: number, b: number, c: number): number;
