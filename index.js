const express = require('express');
const proxy = require('express-http-proxy');
const config = require('config');

const port = config.get('port');
const target = config.get('target');

const app = express();

app.options((req, res) => {
  res.sendStatus(200);
});

app.use(proxy(target));

app.listen(port, () => {
  console.log(`Proxy listening on port ${port}`);
});
