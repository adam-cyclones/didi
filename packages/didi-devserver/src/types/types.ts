export interface IDevServerArgs {
  /*
  * the web root - or ["path/to/root1", "path/to/root2"] for multiple web roots
  * */
  root: string,
  /**
   * the host to listen to
   * */
  host: string | '127.0.0.1',
  /**
   * The port to listen to
   * */
  port: number;
  index: string;
  verbose: boolean;
  https: {},
  /**
   * string or an array of paths, regexs or globs
   * */
  reload: { // can be a string an array or an object. defaults to undefined.
    /**
     * string or an array of paths, regexs or globs
     * */
    watch: string;
    /**
     * use a custom livereload port
     * */
    port: number;
    /**
     *  Use a custom livereload script src
     * */
    src: string;
  }
}