# Recipe Box & Meal Planner

This is a full-stack web application for managing recipes and planning meals. This project is built as a learning vehicle for SDLC practices including testing, CI/CD, deployment, and professional development workflows.

## Tech Stack

-   **Frontend**: React, Vite, TailwindCSS
-   **Backend**: Node.js, Express.js

## Running the Application

To run the application, you need to start both the backend and frontend servers.

### Backend

1.  Navigate to the `backend` directory:
    ```sh
    cd recipe-box/backend
    ```
2.  Install dependencies:
    ```sh
    npm install
    ```
3.  Start the server:
    ```sh
    node server.js
    ```
    The backend server will be running on `http://localhost:3001`.

### Frontend

1.  Navigate to the `frontend` directory:
    ```sh
    cd recipe-box/frontend
    ```
2.  Install dependencies:
    ```sh
    npm install
    ```
3.  Start the development server:
    ```sh
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

## Development Workflow

This project follows a feature-branch workflow. Each new feature will be developed in its own branch and then merged into the main branch via a pull request.
