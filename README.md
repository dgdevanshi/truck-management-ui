# PlantFlow - Truck Management System

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)

## Features

- **User Authentication**: Secure login and registration system with role-based access control
- **Truck Tracking**: Real-time monitoring of trucks at different checkpoints
- **Workflow Management**: Define and manage checkpoints and workflows
- **Check-in/Check-out System**: Log truck movements between checkpoints
- **Reporting**: Generate and export reports on truck turnaround times
- **User Management**: Admin interface for managing operators and their checkpoint assignments
- **Responsive Design**: Works on desktop and mobile devices

## Technologies

- **Frontend**:
  - React 18
  - Redux Toolkit for state management
  - React Router for navigation
  - Tailwind CSS for styling
  - Vite as the build tool
  
- **API Integration**:
  - Axios for HTTP requests
  - JWT authentication

## Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/plantflow.git
   cd plantflow
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env` file in the root directory with the required environment variables (see [Environment Variables](#environment-variables) section).

## Running the Application

### Development Mode

\`\`\`bash
npm run dev
\`\`\`


### Building for Production

\`\`\`bash
npm run build
\`\`\`

### Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

\`\`\`
VITE_API_URL=https://8253-103-208-68-158.ngrok-free.app
\`\`\`

## Project Structure

\`\`\`
plantflow/
├─ public/               # Public assets
├─ src/                  # Source code
│  ├─ components/        # Reusable UI components
│  ├─ features/          # Feature modules with Redux slices and services
│  │  ├─ auth/           # Authentication feature
│  │  ├─ operator/       # Operator dashboard feature
│  │  ├─ reports/        # Reporting feature
│  │  ├─ trucks/         # Truck management feature
│  │  ├─ users/          # User management feature
│  │  └─ workflows/      # Workflow management feature
│  ├─ layouts/           # Page layout components
│  ├─ pages/             # Page components
│  │  ├─ admin/          # Admin pages
│  │  ├─ auth/           # Authentication pages
│  │  └─ operator/       # Operator pages
│  ├─ store/             # Redux store configuration
│  ├─ utils/             # Utility functions
│  ├─ App.jsx            # Main application component
│  ├─ index.css          # Global styles
│  └─ main.jsx           # Application entry point
├─ .env                  # Environment variables
└─ vite.config.js        # Vite configuration
\`\`\`

### Key Directories and Files

- **components/**: Reusable UI components like `LoadingSpinner`, `ResponsiveTable`, etc.
- **features/**: Contains feature modules, each with its own Redux slice and service files:
  - **auth/**: Authentication logic and API calls
  - **operator/**: Operator dashboard functionality
  - **reports/**: Reporting functionality
  - **trucks/**: Truck management functionality
  - **users/**: User management functionality
  - **workflows/**: Workflow and checkpoint management
- **layouts/**: Page layout components for different user roles
- **pages/**: Page components organized by user role
- **store/**: Redux store configuration
- **utils/**: Utility functions including:
  - **apiLogger.js**: Logging utilities for API calls
  - **apiTest.js**: API connection testing utilities
  - **checkpointUtils.js**: Utilities for checkpoint management
  - **jwtDecode.js**: JWT token decoding utility

## User Roles

### Admin
- Access to all system features
- User management
- Workflow configuration
- Reporting
- Truck monitoring

### Operator
- Assigned to specific checkpoints
- Check-in and check-out trucks
- View trucks at their assigned checkpoint
- Create new trucks (if assigned to Entry Gate)

## Checkpoint Flow

The system is designed around a circular checkpoint flow:

1. Entry Gate
2. Front Office
3. Weigh Bridge
4. QC
5. Material Handling
6. Weigh Bridge (return)
7. Front Office (return)
8. Entry Gate (exit)

Trucks progress through these checkpoints as they are checked in and out by operators.
