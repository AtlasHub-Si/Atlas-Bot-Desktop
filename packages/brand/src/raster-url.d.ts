/** Resolve approved raster URLs at build time in both Vite SSR and Electron renderer. */
declare module "*.png?url" {
  const url: string;
  export default url;
}
