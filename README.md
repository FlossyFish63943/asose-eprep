# ASOSE ePrep

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/FlossyFish63943/asose-eprep)

ASOSE ePrep is a dynamic and interactive quiz platform designed with a striking retro-futuristic aesthetic. Built for the students of ASOSE, it provides an engaging way to prepare for exams through a series of quizzes. The application features a stunning neon-on-dark interface reminiscent of 90s computer terminals, complete with pixelated fonts, CRT scanline effects, and glitch animations. Users can enter their name, select from a dynamically loaded list of quizzes, and receive instant feedback and scoring upon completion. A cumulative leaderboard tracks top performers across all quizzes, fostering a competitive learning environment. The entire system is built on Cloudflare's serverless infrastructure, ensuring scalability and high performance. Maintenance is streamlined, allowing new quizzes to be added simply by updating the backend data.

## ✨ Key Features

- **Dynamic JSON Quizzes**: Easily load and manage quizzes with minimal downtime. New quizzes can be added by simply editing JSON files.
- **Retro-Futuristic UI**: A unique, visually stunning interface with neon aesthetics, pixelated fonts, and CRT effects.
- **Responsive Design**: Flawless experience on mobile, tablet, and desktop devices.
- **Instant Feedback**: Users receive immediate scoring and feedback upon completing a quiz.
- **Cumulative Leaderboard**: A high-score table tracks top performers across all quizzes.
- **Persistent User Name**: The application remembers the user's name from previous sessions for convenience.
- **Scalable Backend**: Built on Cloudflare Workers and Durable Objects for high performance and reliability.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, React Router, Zustand, Framer Motion
- **Backend**: Hono on Cloudflare Workers
- **Storage**: Cloudflare Durable Objects
- **Styling**: Tailwind CSS, shadcn/ui
- **Language**: TypeScript

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for interacting with the Cloudflare platform.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd asose_eprep
    ```

2.  **Install dependencies:**
    This project uses Bun as the package manager.
    ```sh
    bun install
    ```

### Running Locally

To start the development server, which includes both the Vite frontend and the Hono backend worker, run:

```sh
bun run dev
```

This will start the application, typically on `http://localhost:3000`.

## 🏗️ Project Structure

The project is organized into three main directories:

-   `src/`: Contains the frontend React application code, including pages, components, hooks, and styles.
-   `worker/`: Contains the backend Hono application running on a Cloudflare Worker. This is where API routes and data logic reside.
-   `shared/`: Contains TypeScript types and interfaces shared between the frontend and the backend to ensure type safety.

## 💻 Development

### Backend (Cloudflare Worker)

-   **API Routes**: New API endpoints should be added in `worker/user-routes.ts`. The file uses Hono for routing.
-   **Data Entities**: Business logic for data persistence is handled by entities defined in `worker/entities.ts`. These entities interact with the Cloudflare Durable Object storage.

### Frontend (React)

-   **Pages**: Application views are located in `src/pages/`.
-   **Components**: Reusable UI components, including those from shadcn/ui, are in `src/components/`.
-   **State Management**: Global state is managed using Zustand. Store hooks are located in `src/hooks/`.
-   **API Client**: A simple API client for making requests to the backend is available at `src/lib/api-client.ts`.

### Shared Types

To maintain type safety across the full stack, define all shared data structures in `shared/types.ts`. These types are accessible to both the frontend and the worker.

## ☁️ Deployment

This project is designed for seamless deployment to the Cloudflare network.

1.  **Build the project:**
    This command bundles the frontend and prepares the worker for deployment.
    ```sh
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Make sure you are logged in to your Cloudflare account via the Wrangler CLI. Then, run the deploy command:
    ```sh
    bun run deploy
    ```

This will publish your application to your configured Cloudflare Workers domain.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/FlossyFish63943/asose-eprep)

## 📄 License

This project is licensed under the MIT License.