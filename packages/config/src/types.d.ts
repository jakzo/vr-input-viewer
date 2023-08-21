declare module "resolve/lib/node-modules-paths.js" {
  export interface Options<R = unknown> {
    moduleDirectory: string | string[];
    paths:
      | string[]
      | ((
          request: R,
          start: string,
          func: () => string[],
          opts?: Options<R>,
        ) => string[]);
  }
  function nodeModulesPaths<R = unknown>(
    start: string,
    opts?: Options<R>,
    request?: R,
  ): string[];
  export default nodeModulesPaths;
}
