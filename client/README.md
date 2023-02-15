# Frontend Initialization

Start in the client directory.

### Install the dependencies

```bash
yarn
# or
npm install
```

### Configure environment variables

```bash
cp .env_example .env
# Modify the variables if needed.
nano .env
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
yarn quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Build and run the app containerized with Nginx as the web server

You may want to update the nginx configuration file at src/config/default.conf first.

```bash
docker build -t game-role-attendent-client .
docker run -p 9000:80 -d game-role-attendent-client
```
