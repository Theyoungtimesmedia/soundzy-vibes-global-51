# Soundzy World Global - Website Project

## Project Overview

This is the official website for Soundzy World Global (SWG), a premier entertainment and event services company based in Port Harcourt, Nigeria.

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend & Database)

## Local Development

To run this project locally:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm i

# Step 4: Start the development server
npm run dev
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── integrations/  # Third-party integrations

supabase/
├── functions/     # Edge functions
└── migrations/    # Database migrations
```

## Features

- DJ & Entertainment Services
- Equipment Shop & Rental
- Creative & Design Services
- AI-Powered Customer Support Chatbot
- Admin Dashboard
- Blog & Content Management
- Real-time Chat System

## Environment Setup

Make sure to configure your environment variables for Supabase connection.

## Deployment

The project is configured for automatic deployment. Backend changes (edge functions, database migrations) deploy immediately, while frontend changes require manual deployment trigger.
