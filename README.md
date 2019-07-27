# Proxy Box

A CLI to create and manage containerized proxy servers. Useful for woking around HTTPS and CORS hurdles in local development environments.

### Getting started

#### Dependencies

In order for proxy-box to do its thing, you'll need the following installed:

* Node (>=8) & NPM (>= 5)
* Docker

#### Setup

First, install the `proxy-box` package globally:
```bash
npm install -g proxy-box
```

Next, if you're going to be using the HTTPS listener, you'll want to download [this localhost SSL certificate](server/ssl/localhost.crt) and install it in your list of locally trusted roots. How you do that is dependent on your OS/browser, so you're gonna have to Google it if you're unfamiliar.

Finally, you'll want to initialize the `proxy-box` Docker image:
```bash
pxbx init
```

And you should be ready to start making boxes!

### Usage

#### `pxbx init`

This command initializes `proxy-box` by downloading the Docker image it relies on to create instances. You can use the `--skip-pull` flag to force the image to build locally instead of attempting to pull from Docker Hub.

| Flag          | Description                                   |
|---------------|-----------------------------------------------|
| `--skip-pull` | Skip attempting to pull image from Docker Hub |
| `--debug`     | Enable debug logging for this command         |
| `--help`      | View help docs for this command               |

#### `pxbx create`

This command creates `proxy-box` instances. You can pass it a config file with the `--file` or `-f` flags, or provide full configuration via flags. If you do both, the flags you provide in the command will override config file properties.

| Flag           | Description                           |
|----------------|---------------------------------------|
| `--file`, `-f` | Path to a config file                 |
| `--target`     | The proxy target URL                  |
| `--http`       | The port to listen on for HTTP        |
| `--https`      | The port to listen on for HTTPS       |
| `--cors`       | Enable CORS handling                  |
| `--debug`      | Enable debug logging for this command |
| `--help`       | View help docs for this command       |

A config file might look something like this:
```json
{
  "http": 4000,
  "https": 4443,
  "target": "https://localhost:3000",
  "cors": true
}
```

Of the configuration options, `target` and at least one of `http` or `https` is required to create an instance.

Some example commands:
```bash
# Create from a config file
pxbx create mybox -f config.json

# Create a simple HTTP proxy to localhost
pxbx create mybox --http 5000 --target http://localhost:3000

# Use a config file but override some properties
pxbx create mybox -f config.json --https 8443 --cors
```

#### `pxbx start`

This command starts your `proxy-box` instances. It takes a name as its third argument, and that's basically it.

| Flag      | Description                           |
|-----------|---------------------------------------|
| `--debug` | Enable debug logging for this command |
| `--help`  | View help docs for this command       |

An example command:
```bash
# Start an instance named "mybox"
pxbx start mybox
```

#### `pxbx stop`

This command stops your `proxy-box` instances. It also takes a name as its third argument, and that's basically it.

| Flag      | Description                           |
|-----------|---------------------------------------|
| `--debug` | Enable debug logging for this command |
| `--help`  | View help docs for this command       |

An example command:
```bash
# Stop an instance named "mybox"
pxbx stop mybox
```

#### `pxbx rm`

This command removes your `proxy-box` instances. It takes a name as its third argument, and you can pass it `--force` or `-f` to force remove running instances.

| Flag            | Description                           |
|-----------------|---------------------------------------|
| `--force`, `-f` | Force remove a running instance       |
| `--debug`       | Enable debug logging for this command |
| `--help`        | View help docs for this command       |

Some example commands:
```bash
# Remove a stopped instance named "mybox"
pxbx rm mybox

# Remove a running instance named "alsomybox"
pxbx rm -f alsomybox
```

#### `pxbx logs`

This command retrieves logs from your `proxy-box` instances. It takes a name as its third argument, and you can pass it `--follow` or `-f` to tail the logs for running instances.

| Flag             | Description                           |
|------------------|---------------------------------------|
| `--follow`, `-f` | Tail logs for a running instance      |
| `--debug`        | Enable debug logging for this command |
| `--help`         | View help docs for this command       |

Some example commands:
```bash
# View logs for an instance named "mybox"
pxbx logs mybox

# Tail logs for a running instance named "mybox"
pxbx logs -f mybox
```

#### `pxbx ls`

This command lists your `proxy-box` instances. It'll tell you the name, status, and configuration of each.

An example command
```bash
# List those instances
pxbx ls
```

### Development

To work on `pxbx` locally, you can use `npm link` to make the command available.

To work on the proxy server image itself, you can use `npm run dev` inside the `server` directory to start up a dev server. For example:
```bash
npm run dev -- --target http://localhost:3000 --http 5000 --https 6000
```
