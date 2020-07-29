"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devServer = void 0;
const koa_1 = __importDefault(require("koa"));
const mime_types_1 = __importDefault(require("mime-types"));
const minimist_1 = __importDefault(require("minimist"));
const path_1 = require("path");
const url_1 = require("url");
const fs_1 = require("fs");
const { readFile } = fs_1.promises;
const argv = minimist_1.default(process.argv.slice(2));
const readWithMime = (ctx, path) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = yield readFile(path, 'utf8');
    ctx.type = mime_types_1.default.lookup(path_1.extname(url_1.parse(ctx.request.url).pathname));
});
exports.devServer = ({ host, index, https, port, reload, root, verbose, }) => __awaiter(void 0, void 0, void 0, function* () {
    const dev = new koa_1.default();
    if (root && index) {
        dev.use((ctx) => __awaiter(void 0, void 0, void 0, function* () {
            if (ctx.request.url === '/') {
                try {
                    yield readWithMime(ctx, path_1.resolve(root, index));
                }
                catch (e) {
                    ctx.body = '500';
                }
            }
            else {
                console.log(root, path_1.resolve(root, url_1.parse(ctx.request.url.replace('/', '')).pathname));
                yield readWithMime(ctx, path_1.resolve(root, url_1.parse(ctx.request.url.replace('/', '')).pathname));
                console.log(ctx.type, ctx.request.url);
            }
        }));
        dev.listen(port);
    }
});
if (Object.keys(argv).length > 1) {
    exports.devServer({
        host: argv.host,
        index: argv.index,
        https: argv.https,
        port: argv.port,
        reload: argv.reload,
        root: argv.root,
        verbose: argv.verbose,
    });
}
