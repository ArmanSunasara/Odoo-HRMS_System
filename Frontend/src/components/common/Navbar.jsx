import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { authService } from "../../services/authService";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    return user.role === "ADMIN" ? "/admin/dashboard" : "/employee/dashboard";
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={getDashboardPath()}>
          <span className="brand-name">Dayflow</span>
          <span className="brand-tagline">HRMS</span>
        </Link>
      </div>
      <div className="navbar-menu">
        {user ? (
          <>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
