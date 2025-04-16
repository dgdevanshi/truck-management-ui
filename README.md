If your **README.md** is breaking when uploading to GitHub, it's likely due to **Markdown formatting issues**. Here's a cleaned and fixed version of your README with proper formatting:

---

# PlantFlow - Truck Management System

## Table of Contents

- [Features](#features)  
- [Technologies](#technologies)  
- [Installation](#installation)  
- [Running the Application](#running-the-application)  
- [Environment Variables](#environment-variables)  
- [Project Structure](#project-structure)  
- [User Roles](#user-roles)  
- [Checkpoint Flow](#checkpoint-flow)

---

## Features

- **User Authentication**: Secure login and registration system with role-based access control  
- **Truck Tracking**: Real-time monitoring of trucks at different checkpoints  
- **Workflow Management**: Define and manage checkpoints and workflows  
- **Check-in/Check-out System**: Log truck movements between checkpoints  
- **Reporting**: Generate and export reports on truck turnaround times  
- **User Management**: Admin interface for managing operators and their checkpoint assignments  
- **Responsive Design**: Works on desktop and mobile devices  

---

## Technologies

### Frontend:
- React 18  
- Redux Toolkit for state management  
- React Router for navigation  
- Tailwind CSS for styling  
- Vite as the build tool  

### API Integration:
- Axios for HTTP requests  
- JWT authentication  

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/plantflow.git
   cd plantflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the required environment variables (see [Environment Variables](#environment-variables)).

---

## Running the Application

### Development Mode
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## Environment Variables

Create a `.env` file in the root directory with the following:

```env
VITE_API_URL=https://8253-103-208-68-158.ngrok-free.app
```

---

## Project Structure

```
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
```

### Key Directories and Files

- **components/**: Reusable UI components like `LoadingSpinner`, `ResponsiveTable`, etc.  
- **features/**: Each feature module contains Redux slice + API logic:  
  - `auth/`, `operator/`, `reports/`, `trucks/`, `users/`, `workflows/`  
- **utils/**:
  - `apiLogger.js`, `apiTest.js`, `checkpointUtils.js`, `jwtDecode.js`  

---

## User Roles

### Admin
- Full access to all features  
- Can manage users, workflows, and generate reports  
- Can monitor trucks at all checkpoints  

### Operator
- Assigned to one or more checkpoints  
- Can check-in/out trucks at assigned checkpoint  
- Can create trucks at Entry Gate only  
- Can view truck statuses related to their checkpoint  

---

## Checkpoint Flow

The system follows a circular checkpoint flow for trucks:

1. **Entry Gate**  
2. **Front Office**  
3. **Weigh Bridge**  
4. **QC**  
5. **Material Handling**  
6. **Weigh Bridge (Return)**  
7. **Front Office (Return)**  
8. **Entry Gate (Exit)**  

Trucks move sequentially through the above checkpoints. Each check-in/check-out is logged for reporting and real-time tracking.

---