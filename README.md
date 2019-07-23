# Proxy Box

### Getting started

First:
```
npm install
```

Then, create a `local.json` file in the `config` directory. It should look like this:
```jsonc
{
  "httpPort": 4000, // The port to listen on for HTTP
  "httpsPort": 4443, // The port to listen on for HTTPS
  "target": "http://localhost:3000", // The proxy target
  "cors": true // enable this to relieve CORS headaches
}
```
Of those properties, `target` and at least one of `httpPort` or `httpsPort` are required.

Finally:
```
npm start
```

**FOR HTTPS:** Because the HTTPS credentials used are self-signed, they'll throw errors in most browsers out of the box. In order to make it not do that for you, you'll need to explicitly trust the localhost certificate. Depending on what browser/OS you're using the steps to do that vary, so you're gonna have to Google it.
