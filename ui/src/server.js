import logger from '../../lib/logger.js';
import Express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import httpProxy from 'http-proxy';
import path, { dirname } from 'path';
import { fileURLToPath } from "url";
import http from 'http';
import fs from 'fs';
import morgan from 'morgan';
import mkdirp from 'mkdirp';
import * as FileStreamRotator from 'file-stream-rotator'
import config from './config.js';
import renderApp from './controllers/renderApp.js';
import renderDashboard from './controllers/renderDashboard.js';

process.on('SIGINT', () => {
  process.exit(0);
});

const targetUrl = `http://${config.apiHost}:${config.apiPort}`;
const app = new Express();

app.use(helmet({
  frameguard: config.enableFrameguard,
  contentSecurityPolicy: false
}));

const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
  target: targetUrl
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// log directory
const logDirectory = process.env.LOG_DIR || path.join(__dirname, '..', '..', 'logs');

// check if log folder exists - create if not
if (!fs.existsSync(logDirectory)) {
  mkdirp.sync(logDirectory);
}

// rotate log files
const accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: `${logDirectory}/access-%DATE%.log`,
  frequency: 'daily',
  verbose: false
});

// log API requests
morgan.token('query', req => JSON.stringify(req.query));

app.use(morgan(':method :url :remote-addr :referrer :date :query :status', { stream: accessLogStream }));

app.use(compression());
app.use(cookieParser());
// To load static assets (like css)
app.use(Express.static(__dirname));
app.use(Express.static(path.join(__dirname, '..', 'public'), {
  setHeaders: (res, path2) => {
    if (path2.match(/fonts\/.+\.woff2/)) {
      res.setHeader('Content-Type', 'font/woff2');
    }
  }
}));

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl });
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  if (error.code !== 'ECONNRESET') {
    logger.error('proxy error', error);
  }
  if (!res.headersSent && res.writeHead) {
    logger.debug('proxy res.writeHead', res.writeHead);
    res.writeHead(500, { 'content-type': 'application/json' });
  }

  const json = { error: 'proxy_error', reason: error.message };
  res.end(JSON.stringify(json));
});

app.use('/dashboards/:dashboardId/:shareableId', renderDashboard);
app.use('/dashboards/:dashboardId', renderDashboard);
app.use('*', renderApp);

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.log('Having error')
      logger.error(err);
    }
    console.log(config)
    logger.info(
      `==> ✅  ${config.app.title} is running on ${config.port}, talking to API server on ${config.apiPort}.`, '\n',
      `==> 💻  Open ${process.env.SITE_URL} in a browser to view the app.`, '\n',
      '--- \n'
    );
    if (process.send) process.send('ready');
  });
} else {
  logger.error('==>     ERROR: No PORT environment variable has been specified');
}
