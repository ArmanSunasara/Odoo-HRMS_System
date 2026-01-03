import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authService } from "../services/authService";
import { loginSuccess, logout } from "../redux/slices/authSlice";
import Loader from "../components/common/Loader";

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * @param {ReactNode} children - Protected component
 * @param {string} requiredRole - Required role (ADMIN, EMPLOYEE) - optional
 */
function PrivateRoute({ children, requiredRole = null }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // If we have a token but no user, try to fetch current user
      if (token && !user) {
        try {
          const currentUser = await authService.getCurrentUser();
          dispatch(loginSuccess({ user: currentUser, token }));
        } catch (error) {
          // Token is invalid, logout
          dispatch(logout());
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [token, user, dispatch]);

  if (isChecking) {
    return <Loader message="Checking authentication..." />;
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const dashboardPath =
      user.role === "ADMIN" ? "/admin/dashboard" : "/employee/dashboard";
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
}

export default PrivateRoute;
