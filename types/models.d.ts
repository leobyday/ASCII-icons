import type { SDF } from "./ascii3d";
/** The bundled model library; requiring it registers every model with the renderer. */
declare const models: Record<string, SDF>;
export = models;
