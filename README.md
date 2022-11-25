# Application Security: Forum

## Start the system

To start the system execute the following commands:

```
docker-composer --profile backend build
docker-composer --profile backend up -d
```

## Access to the web application

You can access to the application via `http://localhost` or `https://localhost`. If you access to the HTTP version the reverse proxy will redirect you to the HTTPS site.

## Stop the system

To stop the system execute the following command:

```
docker-composer down
```

