import Koa from 'koa';
import mime from 'mime-types';
import minimist, { ParsedArgs } from 'minimist';
import { IDevServerArgs } from './types/types';
import { extname, resolve } from 'path';
import { parse } from 'url';
import { promises } from 'fs';

const { readFile } = promises;

const argv: Partial<IDevServerArgs & ParsedArgs> = minimist(process.argv.slice(2));

const readWithMime = async (ctx: Koa.Context, path: string) => {
  ctx.body = await readFile(path, 'utf8');
  ctx.type = mime.lookup(extname(parse(ctx.request.url).pathname as string));
};

export const devServer = async ({
  host,
  index,
  https,
  port,
  reload,
  root,
  verbose,
}: Partial<IDevServerArgs>) => {
  const dev = new Koa();

  if (root && index) {
    dev.use(async (ctx) => {
      if (ctx.request.url === '/') {
        try {
          await readWithMime(ctx, resolve(root, index));
        } catch (e) {
          ctx.body = '500';
        }
      } else {
        console.log(root, resolve(root, parse(ctx.request.url.replace('/', '')).pathname as string));
        await readWithMime(ctx, resolve(root, parse(ctx.request.url.replace('/', '')).pathname as string));
        console.log(ctx.type, ctx.request.url);
      }
    });
    dev.listen(port);
  }
};

if (Object.keys(argv).length > 1) {
  devServer({
    host: argv.host,
    index: argv.index,
    https: argv.https,
    port: argv.port,
    reload: argv.reload,
    root: argv.root,
    verbose: argv.verbose,
  });
}