const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const proxy = require('http-proxy-middleware');
const containerized = require('containerized');
const config = require('./config');

const app = express();

let target = config.get('target');
const httpsPort = config.get('httpsPort');
const httpPort = config.get('httpPort');
const enableCors = config.get('cors');

const protocolRegexp = /^https?:\/\//;
if (!protocolRegexp.test(target)) {
  target = `http://${target}`;
}

function replaceHostname(url, hostname) {
  return url.replace(hostname, 'host.docker.internal');
}

function getOrigin(req) {
  let origin = req.get('Origin');
  if (!origin) {
    const referer = req.get('Referer');

    if (!referer) {
      console.warn('Unable to determine request origin');
    } else {
      const url = new URL(referer);
      origin = `${url.protocol}//${url.host}`;
    }
  }

  return origin;
}

if (containerized()) {
  if (target.includes('localhost')) {
    target = replaceHostname(target, 'localhost');
  } else if (target.includes('127.0.0.1')) {
    target = replaceHostname(target, '127.0.0.1');
  } else if (target.includes('0.0.0.0')) {
    target = replaceHostname(target, '0.0.0.0');
  }
}

const proxyOptions = {
  target,
  changeOrigin: true,
  followRedirects: true,
  onProxyRes: (proxyRes, req) => {
    if (enableCors) {
      proxyRes.headers['Access-Control-Allow-Origin'] = getOrigin(req);
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
      proxyRes.headers['Access-Control-Allow-Headers'] = '*';
    }
  }
};

if (enableCors) {
  app.options('/**', (req, res) => {
    res.set('Access-Control-Allow-Origin', getOrigin(req));
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.set('Allow', 'GET,POST,PUT,DELETE,OPTIONS');

    res.status(200).json({});
  });
}

app.use('/**', proxy(proxyOptions));

if (httpsPort) {
  const key = fs.readFileSync(path.join(__dirname, 'ssl', 'localhost.key'));
  const cert = fs.readFileSync(path.join(__dirname, 'ssl', 'localhost.crt'));
  const credentials = { key, cert };

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS running on port ${httpsPort}`);
  });
}

if (httpPort) {
  const httpServer = http.createServer(app);
  httpServer.listen(httpPort, () => {
    console.log(`HTTP running on ${httpPort}`);
  });
}
