# R Blog Site

This is a full-stack blog application with a React frontend and a Node.js backend.

<img src="./src/assets/R_blog_site_logo.png">

## Features

*   **User Authentication:** Secure login and signup functionality.
*   **Blog Management:** Create, edit, and view blog posts.
*   **User Profiles:** View your own blog posts from your profile.
*   **Quick Reply:** Quickly reply to comments from your dashboard.
*   **Dashboard:** A central place to manage your blog and comments.

## Tech Stack

### Frontend

*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS

### Backend

*   **Framework:** Node.js with Express
*   **Database:** MongoDB with Mongoose
*   **Authentication:** JSON Web Tokens (JWT)

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
2.  **Install dependencies for both frontend and backend:**
    ```bash
    cd blog
    npm install
    cd backend
    npm install
    ```

## Build and Run

### Frontend

To run the frontend in development mode:

```bash
npm run dev
```

### Backend

To run the backend server:

```bash
cd backend
nodemon
```

## Docker

This project is containerized with Docker.

### Docker Compose

The `compose.yaml` file can be used to run the entire application (frontend and backend).

```bash
docker-compose up -d
```

To stop the services:

```bash
docker-compose down
```
