import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Sidebar() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Define menu items based on user role
  const getMenuItems = () => {
    if (!user) return [];

    const isAdmin = user.role === "ADMIN";
    const isEmployee = user.role === "EMPLOYEE";

    const commonItems = [
      {
        name: "Dashboard",
        path: isAdmin ? "/admin/dashboard" : "/employee/dashboard",
        icon: "📊",
      },
      { name: "Profile", path: "/profile", icon: "👤" },
      { name: "Attendance", path: "/attendance", icon: "⏰" },
      { name: "Leave", path: "/leave", icon: "📅" },
    ];

    if (isAdmin) {
      commonItems.push({ name: "Payroll", path: "/payroll", icon: "💰" });
    } else if (isEmployee) {
      commonItems.push({ name: "Payroll", path: "/payroll", icon: "💰" });
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Menu</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={isActive(item.path) ? "active" : ""}
            >
              <Link to={item.path}>
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
