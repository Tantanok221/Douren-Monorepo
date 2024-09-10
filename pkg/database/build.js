import { parse } from "dotenv";
import { config } from "dotenv";
import { build } from "esbuild";
import esbuildPluginTsc from "esbuild-plugin-tsc";
import { readFileSync } from "fs";
const define = {};
const env = parse(readFileSync(".env", {encoding: 'utf8'})) // will return an object

for (const k in env) {
  define[`process.env.${k}`] = JSON.stringify(env[k].replace("'",""));
}
console.log(define)
const options = {
  entryPoints: ["src/**"],
  outdir: "./dist",
  plugins: [
    esbuildPluginTsc({
      force: true,
    }),
  ],
  define,
};

build(options).catch(() => process.exit(1));
