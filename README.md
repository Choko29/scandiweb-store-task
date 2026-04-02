# Scandiweb Test Task - Full Stack E-commerce Application

This is the completed test task for Scandiweb. Due to the expiration of my Railway free tier, the live deployment is currently unavailable. However, the project is fully functional and the complete source code is provided here, perfectly configured to run smoothly in a local environment.

## Prerequisites
- Node.js
- PHP (v7.4 or higher)
- MySQL / MariaDB
- Composer

## Local Setup Instructions

### 1. Database Setup
1. Create a local MySQL database named `scandiweb_db`.
2. Import your database schema/data to ensure the tables (`products`, `categories`, `orders`, `order_items`, `attributes`, etc.) are created according to the latest requirements.

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies (if any) and update the autoloader:
   ```bash
   composer dump-autoload
   ```
3. Start the built-in PHP server:
   ```bash
   php -S localhost:8000 -t public
   ```

### 3. Frontend Setup
1. Open a new, separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required NPM packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 4. View the Application
Open your browser and navigate to the local URL provided by Vite (typically `http://localhost:5173`).

---
*Note: All feedback regarding OOP principles, component separation, GraphQL models, and custom hooks has been thoroughly implemented in this final version.*