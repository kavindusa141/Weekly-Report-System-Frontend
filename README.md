# Weekly Report System

This repository contains the Weekly Report System consisting of a React frontend, Node.js/Express backend, and a MongoDB database.

## Setup Instructions

### 1. Installing Dependencies

You will need to install the dependencies for both the frontend and the backend separately. Open your terminal and run the following commands:

**Frontend:**
```bash
cd Weekly-Report-System-Frontend
npm install
```
*Key frontend libraries installed: `react`, `react-dom`, `lucide-react` (icons), and `react-scripts`.*

**Backend:**
```bash
cd Weekly-Report-System-Backend
npm install
```
*Key backend libraries installed: `express` (API framework), `mongoose` (MongoDB object modeling), `jsonwebtoken` & `bcryptjs` (authentication), and `groq-sdk` (Groq AI integration).*

### 2. Running the Database

This project uses MongoDB as its database. You can either use a cloud instance (MongoDB Atlas) or a local MongoDB server.

1. Navigate to the `Weekly-Report-System-Backend` directory.
2. Ensure you have a `.env` file with the following variables configured (replace with your actual database credentials):
   ```env
   NODE_ENV=development
   PORT=5001
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/?appName=Cluster0
   JWT_SECRET=your_super_secret_key_for_authentication
   GROQ_API_KEY=your_groq_api_key
   ```
3. **If using MongoDB Atlas**: Ensure your IP address is whitelisted in your Atlas cluster's Network Access settings. The database runs in the cloud automatically.
4. **If using Local MongoDB**: Ensure your MongoDB service is running locally (`mongod`), and update your `MONGO_URI` to `mongodb://localhost:27017/weekly_report_db`.

### 3. Running Backend

To start the Node.js/Express backend server in development mode (with hot-reloading using nodemon):

```bash
cd Weekly-Report-System-Backend
npm run dev
```

The server should now be running and listening for API requests (e.g., at `http://localhost:5001`).

### 4. Running Frontend

To start the React frontend application in development mode:

```bash
cd Weekly-Report-System-Frontend
npm run dev
```

This will launch the frontend on `http://localhost:3000`. The page will automatically reload if you make any changes to the code.
