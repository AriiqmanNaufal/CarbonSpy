# CarbonSpy.ai - Automated Carbon Footprint Estimator

CarbonSpy.ai is a powerful backend service designed to automatically estimate the carbon footprint of products based on a company's website. Users can submit a URL, and the system will scrape the site, analyze product information using AI, and return a detailed carbon footprint report.

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
  - [Seeding the Database](#seeding-the-database)
- [API Documentation](#api-documentation)
- [Deployment to Railway](#deployment-to-railway)
- [Example AI Prompt & Response](#example-ai-prompt--response)
- [Postman Collection](#postman-collection)

## Features

- **User Authentication**: JWT-based authentication with access and refresh tokens.
- **URL Scraping**: Background job processing for scraping websites using Playwright and Cheerio.
- **AI-Powered Analysis**: Integration with OpenAI's GPT-4o for product analysis and carbon footprint estimation.
- **Database Storage**: MongoDB with Mongoose for storing user data, scan history, and analysis results.
- **Background Jobs**: BullMQ for managing long-running scraping tasks.
- **Caching**: Redis for caching AI results to improve performance and reduce costs.
- **Usage Limits**: Middleware to enforce different usage limits for "free" and "pro" users.
- **Automated Weekly Audits**: Repeatable jobs for re-analyzing websites for "pro" users.
- **API Documentation**: Auto-generated Swagger documentation for all endpoints.

## Tech Stack

- **Backend Framework**: Node.js + Express.js (TypeScript)
- **Web Scraper**: Playwright & Cheerio
- **AI Layer**: OpenAI GPT-4o
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (Access + Refresh Tokens)
- **Caching**: Redis
- **Queue / Background Jobs**: BullMQ
- **Environment Variables**: dotenv
- **Validation**: Zod
- **Logging**: Winston
- **API Docs**: Swagger (OpenAPI 3.0)

## Folder Structure

The project follows a clean architecture pattern, separating concerns into different directories:

```
/src
  /config         # Database, Redis, OpenAI client configs
  /models         # Mongoose schemas and models
  /routes         # API endpoint definitions
  /controllers    # Request/response handlers
  /services       # Business logic
  /jobs           # BullMQ job processors
  /utils          # Helper functions (logger, JWT, etc.)
  /middlewares    # Express middleware (auth, plan guards)
  app.ts          # Express app configuration
  server.ts       # Main server entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Redis
- An OpenAI API Key

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/CarbonSpy.ai.git
    cd CarbonSpy.ai
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
    This will also automatically run the `postinstall` script to download the necessary Playwright browsers.

### Environment Variables

Create a `.env` file in the root of the project and add the following environment variables. You can use the `.env.example` file as a template.

```
MONGO_URI=mongodb://localhost:27017/carbon-spy
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
PORT=3000
```

## Usage

### Running the Development Server

To run the server in development mode with hot-reloading:

```bash
npm run dev
```

The server will be available at `http://localhost:3000`.

### Creating a Production Build

To build the project for production:

```bash
npm run build
```

This will compile the TypeScript code into JavaScript in the `/dist` directory. To run the compiled code:

```bash
npm start
```

### Seeding the Database

To populate the database with test users:

```bash
npm run seed
```

To remove all data from the database:
```bash
npm run seed:destroy
```

## API Documentation

Once the server is running, you can access the interactive Swagger API documentation at `http://localhost:3000/docs`.

## Deployment to Railway

Railway is a great platform for deploying this project with minimal configuration.

1.  **Create a Railway Project**: Go to your Railway dashboard and create a new project.
2.  **Link Your GitHub Repo**: Connect your GitHub account and select the repository for this project.
3.  **Add Services**:
    - Add a **MongoDB** service.
    - Add a **Redis** service.
4.  **Configure Environment Variables**:
    - Railway will automatically inject the connection strings for MongoDB (`MONGO_URI`) and Redis (`REDIS_URL`) into your application's environment.
    - Manually add the following environment variables in the "Variables" tab of your service:
      - `OPENAI_API_KEY`
      - `JWT_SECRET`
      - `JWT_REFRESH_SECRET`
      - `PORT` (Railway sets this automatically, but you can override it if needed)
5.  **Deploy**: Railway will automatically detect the `package.json` and build/deploy your application. The `start` script will be used to run the application after a successful build.

## Example AI Prompt & Response

### Example Prompt

This is an example of a prompt that would be sent to the OpenAI API:

```
Analyze the following product information to estimate its carbon footprint.
Product Name: Eco-Friendly Water Bottle
Description: A reusable water bottle made from 100% recycled plastic.
Materials Mentioned: recycled plastic, stainless steel cap
Packaging Information: shipped in a cardboard box
Logistics Hints: manufactured in North America

Based on this, provide a JSON object with the following structure:
{
  "productName": "...",
  "material": "Categorize the primary material (e.g., Recycled Plastic, Organic Cotton, Aluminum).",
  "packaging": "Describe the likely packaging (e.g., Cardboard box, Plastic wrap).",
  "logistics": "Infer the logistics chain (e.g., Shipped from Asia, Local delivery).",
  "estimatedCO2": "Estimate the CO2 emissions in kg. Be realistic.",
  "comparisonToIndustryAvg": "Compare the estimate to the industry average for this product type (e.g., 'Lower than average', 'Higher than average').",
  "suggestions": ["Provide 2-3 actionable suggestions for reducing the carbon footprint."]
}
```

### Example AI Response

```json
{
  "productName": "Eco-Friendly Water Bottle",
  "material": "Recycled Plastic",
  "packaging": "Cardboard box",
  "logistics": "Manufactured and shipped within North America",
  "estimatedCO2": 1.5,
  "comparisonToIndustryAvg": "Lower than average",
  "suggestions": [
    "Encourage cold water washing to save energy.",
    "Offer a recycling program for old bottles.",
    "Use even lighter-weight materials for the cap."
  ]
}
```

## Postman Collection

A Postman collection is included in the root of the project (`CarbonSpy.ai.postman_collection.json`) to make it easy to test the API.
