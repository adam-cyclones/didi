export interface IDevServerArgs {
    root: string;
    host: string | '127.0.0.1';
    port: number;
    index: string;
    verbose: boolean;
    https: Record<string, never>;
    reload: {
        watch: string;
        port: number;
        src: string;
    };
}
