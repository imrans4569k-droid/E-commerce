# Aura Luxe E-Commerce

Full-stack E-Commerce Website built with React, Node.js, and Bootstrap.

## Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (Node Package Manager)

## Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/imrans4569k-droid/E-commerce.git
cd E-commerce
```

### 2. Install dependencies
From the root directory, run the following command to install dependencies for both the client and the server:
```bash
npm run install:all
```

*(Alternatively, you can manually run `npm install` inside both the `client` and `server` folders.)*

### 3. Environment Variables
Make sure you configure any necessary environment variables for your backend.
- Create a `.env` file in the `server` directory (if required).
- Example variables usually include database connection strings (like `MONGO_URI`), `PORT`, etc.

### 4. Run the Application

You can start the frontend and backend separately using the provided root scripts.

**Start the Backend Server (Development Mode):**
Open a terminal in the root directory and run:
```bash
npm run server:dev
```
*(If you want to run it without nodemon, use `npm run server`)*

**Start the Frontend Client:**
Open a new terminal in the root directory and run:
```bash
npm run client
```

The application should now be accessible in your browser (typically `http://localhost:5173` or `http://localhost:3000` for the frontend).

## Project Structure
- `client/`: Contains the React frontend code.
- `server/`: Contains the Node.js/Express backend code.
