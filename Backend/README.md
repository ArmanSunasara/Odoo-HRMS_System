# Odoo HRMS Backend

Backend API server for the Odoo HRMS System built with Node.js, Express.js, and MongoDB.

## 📋 Overview

This backend provides a RESTful API for managing human resources, including user authentication, attendance tracking, leave management, payroll processing, and dashboard analytics.

## 🚀 Features

- **RESTful API** - Clean and well-structured API endpoints
- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin and Employee roles
- **MongoDB Integration** - NoSQL database with Mongoose ODM
- **Input Validation** - Request validation using express-validator
- **Error Handling** - Centralized error handling middleware
- **Request Logging** - HTTP request logging with Morgan
- **CORS Support** - Cross-origin resource sharing enabled

## 🏗️ Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   ├── db.js          # MongoDB connection configuration
│   │   └── env.js         # Environment variables configuration
│   │
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── userController.js      # User management logic
│   │   ├── attendanceController.js # Attendance management
│   │   ├── leaveController.js     # Leave management
│   │   ├── payrollController.js   # Payroll processing
│   │   └── dashboardController.js # Dashboard statistics
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js      # JWT authentication middleware
│   │   ├── roleMiddleware.js      # Role-based access control
│   │   └── errorMiddleware.js     # Error handling middleware
│   │
│   ├── models/
│   │   ├── User.js         # User/Employee model
│   │   ├── Attendance.js   # Attendance model
│   │   ├── Leave.js        # Leave request model
│   │   └── Payroll.js      # Payroll model
│   │
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── userRoutes.js      # User routes
│   │   ├── attendanceRoutes.js # Attendance routes
│   │   ├── leaveRoutes.js     # Leave routes
│   │   ├── payrollRoutes.js   # Payroll routes
│   │   └── dashboardRoutes.js # Dashboard routes
│   │
│   ├── utils/
│   │   ├── generateToken.js  # JWT token generation
│   │   └── validators.js     # Input validation schemas
│   │
│   ├── app.js        # Express application setup
│   └── server.js    # Server entry point
│
├── nodemon.json      # Nodemon configuration
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## 📦 Dependencies

### Production Dependencies
- **express** (^4.18.2) - Web framework
- **mongoose** (^7.5.0) - MongoDB object modeling
- **bcryptjs** (^2.4.3) - Password hashing
- **jsonwebtoken** (^9.0.2) - JWT token generation
- **cors** (^2.8.5) - Cross-origin resource sharing
- **morgan** (^1.10.0) - HTTP request logger
- **dotenv** (^16.3.1) - Environment variables
- **express-validator** (^7.0.1) - Input validation

### Development Dependencies
- **nodemon** (^3.0.1) - Auto-restart server during development

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the root of the Backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/odoo-hrms
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your system or use MongoDB Atlas connection string.

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```
This uses nodemon to automatically restart the server when files change.

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | User login | No |
| GET | `/me` | Get current user profile | Yes |

### User Routes (`/api/users`)
| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/` | Get all users | Yes | Admin |
| GET | `/:id` | Get user by ID | Yes | - |
| PUT | `/:id` | Update user | Yes | - |
| DELETE | `/:id` | Delete user | Yes | Admin |

### Attendance Routes (`/api/attendance`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/clock-in` | Clock in for the day | Yes |
| POST | `/clock-out` | Clock out for the day | Yes |
| GET | `/` | Get attendance records | Yes |
| GET | `/:id` | Get attendance by ID | Yes |

### Leave Routes (`/api/leave`)
| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/` | Create leave request | Yes | - |
| GET | `/` | Get leave requests | Yes | - |
| GET | `/:id` | Get leave by ID | Yes | - |
| PUT | `/:id` | Update leave request | Yes | - |
| PUT | `/:id/approve` | Approve leave request | Yes | Admin |
| PUT | `/:id/reject` | Reject leave request | Yes | Admin |

### Payroll Routes (`/api/payroll`)
| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/` | Get payroll records | Yes | - |
| GET | `/:id` | Get payroll by ID | Yes | - |
| POST | `/` | Create payroll record | Yes | Admin |
| PUT | `/:id` | Update payroll | Yes | Admin |

### Dashboard Routes (`/api/dashboard`)
| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/admin` | Get admin dashboard stats | Yes | Admin |
| GET | `/employee` | Get employee dashboard stats | Yes | - |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Format
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "ADMIN" | "EMPLOYEE"
}
```

## 📊 Database Models

### User Model
- `employeeId` - Unique employee identifier
- `name` - Employee name
- `email` - Email address (unique)
- `password` - Hashed password
- `role` - ADMIN or EMPLOYEE
- `phone` - Phone number
- `address` - Address
- `jobDetails` - Position, department, date of joining
- `salaryStructure` - Basic salary, allowances, deductions
- `profilePicture` - Profile picture URL
- `isVerified` - Verification status

### Attendance Model
- `userId` - Reference to User
- `clockIn` - Clock in time
- `clockOut` - Clock out time
- `date` - Attendance date
- `status` - Attendance status
- `notes` - Additional notes

### Leave Model
- `userId` - Reference to User
- `leaveType` - Type of leave
- `startDate` - Leave start date
- `endDate` - Leave end date
- `reason` - Leave reason
- `status` - PENDING, APPROVED, REJECTED
- `approvedBy` - Admin who approved/rejected

### Payroll Model
- `userId` - Reference to User
- `month` - Payroll month
- `year` - Payroll year
- `basicSalary` - Basic salary amount
- `allowances` - Allowances amount
- `deductions` - Deductions amount
- `netSalary` - Net salary amount
- `status` - Payroll status

## 🔒 Security Features

1. **Password Hashing**: Passwords are hashed using bcryptjs before storage
2. **JWT Tokens**: Secure token-based authentication
3. **Input Validation**: All inputs are validated using express-validator
4. **Role-Based Access**: Middleware ensures only authorized roles access protected routes
5. **CORS**: Configured to allow requests from frontend origin
6. **Environment Variables**: Sensitive data stored in environment variables

## 🧪 Testing

To test the API endpoints, you can use:

- **Postman** - Import the API collection
- **cURL** - Command-line tool
- **Thunder Client** - VS Code extension
- **Insomnia** - API testing tool

### Example API Request

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get Profile (with token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🐛 Error Handling

The API uses centralized error handling middleware. Errors are returned in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information (in development)"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | Secret key for JWT tokens | - |
| `JWT_EXPIRE` | JWT token expiration time | 30d |
| `NODE_ENV` | Environment (development/production) | development |

## 🚀 Deployment

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start src/server.js --name hrms-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### Using Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 Contributing

1. Follow the existing code style
2. Add comments for complex logic
3. Update this README if adding new features
4. Test your changes before submitting

## 📄 License

MIT License

---

**Note**: Always keep your `.env` file secure and never commit it to version control. Use `.env.example` as a template.
