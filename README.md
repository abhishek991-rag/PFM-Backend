FinTrack - Personal Finance Tracker (Backend)
This is the backend part of the FinTrack application, built using Node.js and Express.js. It is responsible for interacting with the database, handling user authentication, and providing RESTful API endpoints for income, expenses, budget, and goals.

🚀 Features
User Authentication: User registration, login, and authentication using JWT (JSON Web Tokens).

CRUD Operations:

Income: Create, read, update, delete income transactions.

Expense: Create, read, update, delete expense transactions.

Budget: Create, read, update, delete budget entries.

Goal: Create, read, update, delete financial goals.

Secure API: Authentication middleware for sensitive operations.

Database Integration: Using Mongoose ODM with MongoDB.

💻 Technologies
Node.js: Server-side runtime environment.

Express.js: Web application framework.

MongoDB: NoSQL database.

Mongoose: ODM (Object Data Modeling) for MongoDB.

bcryptjs: For password hashing and comparison.

jsonwebtoken (JWT): For generating and verifying web tokens for authentication.

cors: Middleware to enable cross-origin resource sharing.

dotenv: For loading environment variables from a .env file.

winston: For advanced logging.

nodemon (for development only): For automatically restarting the Node application on file changes during development.

⚙️ Setup and Running
Follow these instructions to run the project in your local development environment.

Requirements

Node.js (v18 or higher recommended)

npm (comes with Node.js)

MongoDB Instance (locally or MongoDB Atlas)

Installation Steps
Clone the repository:

git clone https://github.com/your-username/FinTrack.git

cd FinTrack/backend # if your backend is in the 'backend' folder

Install dependencies:

npm install

Configure environment variables:

Create a file called .env in the root of your backend folder.

Add the following variables, replacing with your own values:

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/fintrack?retryWrites=true&w=majority
JWT_SECRET=insert a very long and secure random string here
CLIENT_URL=http://localhost:5173 # URL of your frontend (for local development)

MONGO_URI: Get your database connection string from MongoDB Atlas.

JWT_SECRET: Generate a long, complex, and random string (e.g. by running require('crypto').randomBytes(64).toString('hex')).

Run the application:

Development mode (automatically restarts changes):

npm run dev

Production mode (simple run):

npm start

The server will run on http://localhost:5000 (or on the PORT configured in your .env).

📂 Project structure (main)
backend/
├── controllers/ # Business logic for API endpoints
│ ├── authController.js
│ ├── budgetController.js
│ ├── expenseController.js
│ ├── goalController.js
│ ├── incomeController.js
│ └── userController.js
├── middleware/ # Custom middleware (e.g. authentication)
│ └── authMiddleware.js
├── models/ # MongoDB schema and model definitions
│ ├── Budget.js
│ ├── Expense.js
│ ├── Goal.js
│ ├── Income.js
│ └── User.js
├── routes/ # Route definitions for API endpoints
│ ├── authRoutes.js
│ ├── budgetRoutes.js
│ ├── expenseRoutes.js
│ ├── goalRoutes.js
│ ├── incomeRoutes.js
│ └── userRoutes.js
├── .env # Environment variables (Gitignored)
├── package.json # Project dependencies and scripts
├── package-lock.json # Dependency version lock
└── server.js # Main server entry file

🚀 Deployment
To deploy your backend, you can use a cloud platform like Render, Heroku, or AWS EC2. Render is an easy way to deploy a Node.js/Express app.

Deploy using Render.com:

GitHub repository: Make sure your backend folder is in a GitHub repository.

Create new web service on Render:

Log in to Render and select 'New Web Service'.

Connect your GitHub repository.

Set 'Root Directory' to backend (if your backend code is in this folder).

'Build Command' is npm install.

'Start Command' is npm start.

Configure environment variables (in Render settings):

NODE_ENV: production

PORT: 5000 

MONGO_URI: mongodb+srv://Random:eNf5xkOUNVtXEDUD@cluster01.llapoqe.mongodb.net/?retryWrites=true&w=majority&appName=cluster01.

JWT_SECRET: "anyrandomstring".

CLIENT_URL: URL of your deployed frontend (-----).

Render will automatically deploy the code and update if you push new commits.
