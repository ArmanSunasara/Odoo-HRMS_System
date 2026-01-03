# Odoo HRMS Frontend

Frontend application for the Odoo HRMS System built with React.js and Redux.

## 📋 Overview

This is a modern, responsive web application that provides a user-friendly interface for managing human resources. It includes features for authentication, employee management, attendance tracking, leave management, payroll processing, and role-based dashboards.

## 🚀 Features

- **Modern React UI** - Built with React.js and modern hooks
- **State Management** - Redux for centralized state management
- **Routing** - React Router for navigation
- **Protected Routes** - Authentication-based route protection
- **Role-Based UI** - Different interfaces for Admin and Employee
- **Responsive Design** - Works on desktop and mobile devices
- **API Integration** - Seamless integration with backend API

## 🏗️ Project Structure

```
Frontend/
├── public/
│   └── index.html          # HTML template
│
├── src/
│   ├── assets/             # Static assets (images, icons, etc.)
│   │
│   ├── components/         # Reusable React components
│   │   ├── cards/
│   │   │   ├── AttendanceCard.jsx
│   │   │   └── EmployeeCard.jsx
│   │   └── common/
│   │       ├── Loader.jsx
│   │       ├── Navbar.jsx
│   │       └── Sidebar.jsx
│   │
│   ├── pages/              # Page components
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── dashboard/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── EmployeeDashboard.jsx
│   │   ├── attendance/
│   │   │   └── Attendance.jsx
│   │   ├── leave/
│   │   │   └── LeaveManagement.jsx
│   │   ├── payroll/
│   │   │   └── Payroll.jsx
│   │   └── profile/
│   │       └── Profile.jsx
│   │
│   ├── redux/              # Redux store and slices
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── userSlice.js
│   │   │   ├── attendanceSlice.js
│   │   │   └── leaveSlice.js
│   │   └── store.js
│   │
│   ├── routes/             # Routing configuration
│   │   ├── AppRoutes.jsx
│   │   └── PrivateRoute.jsx
│   │
│   ├── services/           # API service functions
│   │   ├── api.js          # Axios configuration
│   │   ├── authService.js
│   │   ├── attendanceService.js
│   │   ├── leaveService.js
│   │   └── payrollService.js
│   │
│   ├── utils/              # Utility functions
│   │   ├── constants.js
│   │   └── helpers.js
│   │
│   ├── App.jsx             # Main App component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
│
└── README.md               # This file
```

## 🛠️ Technology Stack

- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API calls
- **CSS** - Styling (can be extended with CSS frameworks)

## 📦 Installation

1. **Navigate to Frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (if needed):**
   Create a `.env` file in the Frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Preview Production Build
```bash
npm run preview
```
(If configured in package.json)

## 📱 Pages & Features

### Authentication Pages
- **Login** (`/login`) - User login page
- **Register** (`/register`) - User registration page

### Dashboard Pages
- **Admin Dashboard** (`/dashboard/admin`) - Admin overview with statistics
- **Employee Dashboard** (`/dashboard/employee`) - Employee personal dashboard

### Feature Pages
- **Attendance** (`/attendance`) - Clock in/out and attendance history
- **Leave Management** (`/leave`) - Submit and manage leave requests
- **Payroll** (`/payroll`) - View payroll information
- **Profile** (`/profile`) - User profile management

## 🔐 Authentication Flow

1. User logs in through the Login page
2. JWT token is stored in Redux state and localStorage
3. Token is included in API requests via Axios interceptors
4. Protected routes check authentication status
5. Role-based access control determines available features

## 🗂️ Redux Store Structure

### Auth Slice
- User authentication state
- Login/logout actions
- Token management

### User Slice
- User profile data
- User list (for admin)
- User CRUD operations

### Attendance Slice
- Attendance records
- Clock in/out state
- Attendance history

### Leave Slice
- Leave requests
- Leave balance
- Leave approval workflow

## 🔌 API Integration

The frontend communicates with the backend through service functions located in `src/services/`:

- **authService.js** - Authentication API calls
- **attendanceService.js** - Attendance API calls
- **leaveService.js** - Leave management API calls
- **payrollService.js** - Payroll API calls

### Example API Call
```javascript
import { login } from '../services/authService';

const handleLogin = async (email, password) => {
  try {
    const response = await login(email, password);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## 🛡️ Protected Routes

Routes are protected using the `PrivateRoute` component:

```jsx
<PrivateRoute path="/dashboard" component={Dashboard} />
```

The `PrivateRoute` component:
- Checks if user is authenticated
- Redirects to login if not authenticated
- Checks role permissions for admin routes

## 🎨 Styling

- Global styles in `index.css`
- Component-specific styles can be added
- Consider using CSS modules or styled-components for larger projects
- Can integrate CSS frameworks like Bootstrap, Tailwind CSS, or Material-UI

## 📱 Responsive Design

The application is designed to be responsive:
- Desktop-first approach
- Mobile-friendly navigation
- Responsive cards and tables
- Adaptive layouts

## 🧪 Testing

To add testing (recommended):

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables if needed

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to GitHub Pages
```bash
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d build"

npm run deploy
```

## 🔧 Configuration

### API Base URL
Configure the API base URL in:
- Environment variable: `REACT_APP_API_URL`
- Or directly in `src/services/api.js`

### Routing
Configure routes in `src/routes/AppRoutes.jsx`

### Redux Store
Configure Redux store in `src/redux/store.js`

## 📚 Component Guidelines

1. **Functional Components** - Use functional components with hooks
2. **Props Validation** - Consider using PropTypes or TypeScript
3. **Error Handling** - Handle errors gracefully with try-catch
4. **Loading States** - Show loading indicators during API calls
5. **Form Validation** - Validate forms before submission

## 🐛 Common Issues

### CORS Errors
- Ensure backend CORS is configured correctly
- Check API URL in environment variables

### Authentication Issues
- Verify JWT token is being stored correctly
- Check token expiration
- Ensure token is included in API requests

### API Connection Issues
- Verify backend server is running
- Check API base URL configuration
- Verify network connectivity

## 📝 Best Practices

1. **Code Organization** - Keep components modular and reusable
2. **State Management** - Use Redux for global state, local state for component-specific data
3. **Performance** - Use React.memo, useMemo, and useCallback where appropriate
4. **Error Boundaries** - Implement error boundaries for better error handling
5. **Accessibility** - Follow WCAG guidelines for accessibility

## 🤝 Contributing

1. Follow React best practices
2. Maintain consistent code style
3. Add comments for complex logic
4. Test components before submitting
5. Update this README for new features

## 📄 License

MIT License

---

**Note**: Make sure the backend server is running before starting the frontend application. The default API URL is `http://localhost:5000/api`.
