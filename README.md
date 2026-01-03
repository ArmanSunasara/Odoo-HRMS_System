# Odoo HRMS System

A comprehensive Human Resource Management System (HRMS) built with modern web technologies. This system provides complete HR management capabilities including employee management, attendance tracking, leave management, payroll processing, and role-based dashboards.

## 🚀 Features

- **User Authentication & Authorization**
  - Secure JWT-based authentication
  - Role-based access control (Admin & Employee)
  - User registration and login

- **Employee Management**
  - Employee profile management
  - Employee ID generation
  - Job details and department tracking
  - Profile picture support

- **Attendance Management**
  - Clock in/out functionality
  - Attendance history tracking
  - Attendance reports

- **Leave Management**
  - Leave request submission
  - Leave approval workflow
  - Leave balance tracking
  - Leave history

- **Payroll Management**
  - Salary structure management
  - Basic salary, allowances, and deductions
  - Payroll processing
  - Salary reports

- **Dashboard**
  - Admin dashboard with comprehensive analytics
  - Employee dashboard with personal information
  - Real-time statistics

## 🏗️ Architecture

This project follows a full-stack architecture:

- **Backend**: Node.js with Express.js framework
- **Frontend**: React.js with Redux for state management
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

## 📁 Project Structure

```
Odoo-HRMS__System/
├── Backend/          # Node.js/Express backend API
│   ├── src/
│   │   ├── config/   # Database and environment configuration
│   │   ├── controllers/  # Business logic controllers
│   │   ├── middlewares/ # Authentication and error handling
│   │   ├── models/      # MongoDB/Mongoose models
│   │   ├── routes/      # API route definitions
│   │   ├── utils/       # Utility functions
│   │   ├── app.js       # Express app configuration
│   │   └── server.js    # Server entry point
│   └── package.json
│
├── Frontend/         # React.js frontend application
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # Redux store and slices
│   │   ├── routes/      # React Router configuration
│   │   ├── services/    # API service functions
│   │   └── utils/       # Helper functions
│   └── public/
│
└── README.md         # This file
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **Redux** - State management
- **React Router** - Navigation
- **Axios** - HTTP client

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Odoo-HRMS__System
```

### 2. Backend Setup

Navigate to the Backend directory and install dependencies:

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/odoo-hrms
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=30d
NODE_ENV=development
```

Start the backend server:

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

Navigate to the Frontend directory and install dependencies:

```bash
cd Frontend
npm install
```

Create a `.env` file in the Frontend directory (if needed):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm start
```

The frontend application will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Attendance
- `POST /api/attendance/clock-in` - Clock in
- `POST /api/attendance/clock-out` - Clock out
- `GET /api/attendance` - Get attendance records
- `GET /api/attendance/:id` - Get attendance by ID

### Leave
- `POST /api/leave` - Create leave request
- `GET /api/leave` - Get leave requests
- `GET /api/leave/:id` - Get leave by ID
- `PUT /api/leave/:id` - Update leave request
- `PUT /api/leave/:id/approve` - Approve leave (Admin only)
- `PUT /api/leave/:id/reject` - Reject leave (Admin only)

### Payroll
- `GET /api/payroll` - Get payroll records
- `GET /api/payroll/:id` - Get payroll by ID
- `POST /api/payroll` - Create payroll record (Admin only)
- `PUT /api/payroll/:id` - Update payroll (Admin only)

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard statistics
- `GET /api/dashboard/employee` - Employee dashboard statistics

## 🔐 User Roles

### Admin
- Full system access
- User management
- Leave approval/rejection
- Payroll management
- View all attendance records
- Access admin dashboard

### Employee
- View own profile
- Clock in/out
- Submit leave requests
- View own attendance
- View own payroll
- Access employee dashboard

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/odoo-hrms
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=30d
NODE_ENV=development
```

## 🧪 Testing

Currently, testing scripts are not configured. To add tests:

```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Ensure MongoDB connection string is configured
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name hrms-backend
   ```

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to a static hosting service (Netlify, Vercel, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

-Arman Sunasara
-Rana Heet
-Neel Patel
-Harshit raval

## 🙏 Acknowledgments

- Express.js community
- React.js community
- MongoDB documentation


---

**Note**: Make sure to update the MongoDB connection string and JWT secret in your environment variables before running the application.
