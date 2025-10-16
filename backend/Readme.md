# Blog Backend

This project is a backend service for a blog application. It provides APIs for managing blog posts, users, and comments, and is built using Node.js, Express, and MongoDB. The backend is designed to be scalable and easy to deploy using Docker Compose.

## Docker Compose Usage

To start the backend services in detached mode:

```sh
docker compose -f docker.yaml up -d
```

To stop the services:

```sh
docker compose -f docker.yaml down
```

## Accessing MongoDB Express

*   **URL:** [http://127.0.0.1:8081/](http://127.0.0.1:8081/)
*   **Password:** `pass`