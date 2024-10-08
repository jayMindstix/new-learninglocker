import 'dotenv/config';
import path, { dirname } from 'path';
import { fileURLToPath } from "url";
import run from '../lib/tools/run.js';
import bundle from '../lib/tools/bundle.js';
import newrelicConfig from '../lib/tools/newrelicConfig.js';
import getWebpackConfig from '../lib/tools/getWebpackConfig.js';

const isDebug = !process.argv.includes('--release');
const isVerbose = !!process.argv.includes('--verbose');
const watch = !!process.argv.includes('--watch');
const stats = !!process.argv.includes('--stats');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDir = path.resolve(__dirname, 'src');
const outputDir = path.resolve(__dirname, 'dist', 'server');

const bannerPrefix = newrelicConfig({ appType: 'API' });

const webpackConfig = getWebpackConfig({
  isDebug,
  isVerbose,
  isClient: false,
  sourceDir,
  outputDir,
  stats,
  publicPath: '/',
  entry: {
    server: 'server.js',
  },
  bannerPrefix
});

/**
 * Uses webpack to compile the API server
 * into a single file executable by node
 */
async function build() {
  await run(bundle, { webpackConfig, watch });
}

export default build();
