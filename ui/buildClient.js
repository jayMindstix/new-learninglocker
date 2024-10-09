import 'dotenv/config';
import path, { dirname } from 'path';
import { fileURLToPath } from "url";
import run from '../lib/tools/run.js';
import bundle from '../lib/tools/bundle.js';
import getWebpackConfig from '../lib/tools/getWebpackConfig.js';
import config from './src/config.js';

const isDebug = !process.argv.includes('--release');
// const isDebug = true;
const isVerbose = !!process.argv.includes('--verbose');
const stats = !!process.argv.includes('--stats');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDir = path.resolve(__dirname, 'src');
const outputDir = path.resolve(__dirname, 'dist', 'public');

const webpackConfig = getWebpackConfig({
  isDebug,
  isVerbose,
  isClient: true,
  sourceDir,
  outputDir,
  stats,
  entry: {
    client: 'client.js',
  },
  copyPaths: [{
    from: path.resolve(sourceDir, 'static'),
    to: path.resolve(outputDir, 'static')
  }],
  clientFreeVariables: {}
});

/**
 * Uses webpack to compile the API server
 * into a single file executable by node
 */
async function build() {
  await run(bundle, { webpackConfig, devPort: isDebug ? config.devPort : null });
}

export default build();
