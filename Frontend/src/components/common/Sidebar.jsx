import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Define menu items based on user role
  const getMenuItems = () => {
    if (!user) return [];

    const commonItems = [
      {
        name: "Dashboard",
        path:
          user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard",
      },
      { name: "Profile", path: "/profile" },
      { name: "Attendance", path: "/attendance" },
      { name: "Leave", path: "/leave" },
    ];

    if (user.role === "admin" || user.role === "manager") {
      commonItems.push({ name: "Payroll", path: "/payroll" });
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>HR Management</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={location.pathname === item.path ? "active" : ""}
            >
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
