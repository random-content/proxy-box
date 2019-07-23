const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const config = require('config');
const proxy = require('http-proxy-middleware');

const key = fs.readFileSync(path.join(__dirname, 'ssl', 'localhost.key'));
const cert = fs.readFileSync(path.join(__dirname, 'ssl', 'localhost.crt'));
const credentials = { key, cert };

const target = config.get('target');
const httpsPort = config.get('httpsPort');
const httpPort = config.get('httpPort');
const enableCors = config.get('cors');

const proxyOptions = {
  target: target,
  changeOrigin: true,
  onProxyRes: (proxyRes, req) => {
    if (enableCors) {
      proxyRes.headers['Access-Control-Allow-Origin'] = req.get('Host');
      proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    }
  }
};

if (enableCors) {
  app.options('/**', (req, res) => {
    res.set('Access-Control-Allow-Origin', req.get('Host'));
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.set('Allow', 'GET,POST,PUT,DELETE,OPTIONS');

    res.status(200).json({});
  });
}


app.use('/**', proxy(proxyOptions));




if (httpsPort) {
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
