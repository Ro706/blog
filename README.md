# R Blog Site

This is a full-stack blog application with a React frontend and a Node.js backend.

## Tech Stack

### Frontend

*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Dependencies:**
    *   `react`
    *   `react-dom`
    *   `tailwindcss`

### Backend

*   **Framework:** Node.js with Express
*   **Database:** MongoDB with Mongoose
*   **Authentication:** JSON Web Tokens (JWT)
*   **File Storage:** Google Cloud Storage
## Getting Started

### Prerequisites

*   Node.js
*   npm
*   Docker (optional)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Ro706/blog.git
    ```
2.  **Install frontend dependencies:**
    ```bash
    cd blog
    npm install
    ```
3.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

## Build and Run

### Frontend

To run the frontend in development mode:

```bash
npm run dev
```

To build the frontend for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

### Backend

To run the backend server:

```bash
cd backend
docker compose -f docker.yaml up -d
nodemon
```

## Docker

This project is containerized with Docker.

### Frontend

To build and run the frontend container:

```bash
docker build -t blog-frontend .
docker run -p 3000:3000 blog-frontend
```

### Backend

To build and run the backend container:

```bash
cd backend
docker build -t blog-backend .
docker run -p 5000:5000 blog-backend
```

### Docker Compose

The `compose.yaml` file can be used to run the frontend service.

```bash
docker-compose up
```