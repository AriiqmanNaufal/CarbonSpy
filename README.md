# CarbonSpy.ai - Frontend

This is the official frontend for CarbonSpy.ai, a powerful tool for estimating the carbon footprint of products. Built with Next.js 14 and the App Router, this application provides a clean, modern, and responsive user interface for interacting with the CarbonSpy.ai backend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [Running the Development Server](#running-the-development-server)
  - [Creating a Production Build](#creating-a-production-build)
- [Deployment to Vercel](#deployment-to-vercel)
- [Mock API Responses](#mock-api-responses)

## Features

- **Modern UI/UX**: Built with Next.js 14, Tailwind CSS, and shadcn/ui for a clean and responsive design.
- **State Management**: Centralized state management with Zustand for a predictable and maintainable application state.
- **Authentication**: Secure JWT-based authentication using httpOnly cookies, with protected routes managed by Next.js middleware.
- **Real-time Scan Updates**: Real-time polling for scan status updates, providing a dynamic user experience.
- **Data Visualization**: Interactive charts for visualizing carbon footprint data, powered by Chart.js.
- **Dark/Light Mode**: Full support for dark and light modes with a theme toggle.
- **Form Handling**: Robust form handling with React Hook Form and Zod for validation.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Tailwind CSS & shadcn/ui
- **Charts**: Chart.js + react-chartjs-2
- **State Management**: Zustand
- **Form Handling**: React Hook Form + zod
- **API Layer**: axios
- **Animations**: Framer Motion
- **Icons**: lucide-react

## Folder Structure

The project follows a feature-based folder structure that is organized for scalability and maintainability:

```
/src
  /app          # Next.js App Router pages and API routes
  /components   # Reusable React components
  /lib          # Core utilities (axios, auth, validators)
  /store        # Zustand state management stores
  /types        # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- An instance of the CarbonSpy.ai backend running

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/CarbonSpy.ai-frontend.git
    cd CarbonSpy.ai-frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variable. You can use the `.env.local.example` file as a template.

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

Replace the URL with the actual URL of your running backend instance.

## Usage

### Running the Development Server

To run the server in development mode with hot-reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:3001`.

### Creating a Production Build

To build the project for production:

```bash
npm run build
```

This will create an optimized build in the `.next` directory. To run the compiled code:

```bash
npm start
```

## Deployment to Vercel

Vercel is the recommended platform for deploying this Next.js application.

1.  **Create a Vercel Project**: Go to your Vercel dashboard and create a new project.
2.  **Link Your GitHub Repo**: Connect your GitHub account and select the repository for this project.
3.  **Configure Environment Variables**:
    - In the project settings, go to the "Environment Variables" section and add `NEXT_PUBLIC_API_BASE_URL` with the URL of your deployed backend.
4.  **Deploy**: Vercel will automatically detect the Next.js project and deploy it. Subsequent pushes to the main branch will trigger automatic redeployments.

## Mock API Responses

Here are some examples of the data structures the frontend expects from the API:

### `/auth/me`

```json
{
  "id": "60d0fe4f5311236168a109ca",
  "email": "prouser@example.com",
  "plan": "pro",
  "weeklyCredits": 9999,
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### `/scans`

```json
[
  {
    "id": "60d0fe4f5311236168a109cb",
    "user": "60d0fe4f5311236168a109ca",
    "url": "https://example-store.com/product/eco-friendly-bottle",
    "status": "completed",
    "jobId": "12345",
    "createdAt": "2023-05-10T10:00:00.000Z"
  }
]
```

### `/analysis/results/:scanId`

```json
{
  "data": [
    {
      "id": "60d0fe4f5311236168a109cc",
      "scan": "60d0fe4f5311236168a109cb",
      "productName": "Eco-Friendly Water Bottle",
      "material": "Recycled Plastic",
      "packaging": "Cardboard box",
      "logistics": "Manufactured and shipped within North America",
      "estimatedCO2": 1.5,
      "comparisonToIndustryAvg": "Lower than average",
      "suggestions": [
        "Encourage cold water washing to save energy.",
        "Offer a recycling program for old bottles."
      ],
      "createdAt": "2023-05-10T10:05:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```
