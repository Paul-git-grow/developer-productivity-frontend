import React from "react";
import "../styles/sidebar.css";

function Sidebar({ activePage, setActivePage, onLogout }) {

  // Logged-in user data from localStorage
  const storedUser = localStorage.getItem("user");

  let user = {};

  try {
    user = storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    console.log("User data error:", error);
    user = {};
  }

  // Main sidebar menu
  const menuItems = [
    {
      name: "Dashboard",
      icon: "⌂",
    },
    {
      name: "Projects",
      icon: "📁",
    },
    {
      name: "Tasks",
      icon: "✓",
    },
    {
      name: "Calendar",
      icon: "▣",
    },
    {
      name: "Analytics",
      icon: "◒",
    },
  ];

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          P
        </div>

        <span>Productivity</span>
      </div>


      {/* Main Menu */}
      <div className="sidebar-section">

        <p className="sidebar-label">
          MAIN MENU
        </p>

        <nav>

          {menuItems.map((item) => (

            <button
              key={item.name}
              className={`sidebar-item ${
                activePage === item.name
                  ? "active"
                  : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >

              <span className="sidebar-icon">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>

            </button>

          ))}

        </nav>

      </div>


      {/* General */}
      <div className="sidebar-section">

        <p className="sidebar-label">
          GENERAL
        </p>

        <button
          className={`sidebar-item ${
            activePage === "Settings"
              ? "active"
              : ""
          }`}
          onClick={() => setActivePage("Settings")}
        >

          <span className="sidebar-icon">
            ⚙
          </span>

          <span>
            Settings
          </span>

        </button>

      </div>


      {/* Bottom User Section */}
      <div className="sidebar-bottom">

        <button
          type="button"
          className={`sidebar-user ${
            activePage === "Profile"
              ? "active-user"
              : ""
          }`}
          onClick={() => setActivePage("Profile")}
        >

          {/* User Avatar */}
          <div className="sidebar-avatar">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          {/* User Details */}
          <div className="sidebar-user-info">

            <strong>
              {user.name || "User"}
            </strong>

            <small>
              {user.role || "Developer"}
            </small>

          </div>

        </button>


        {/* Logout */}
        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
          title="Logout"
        >
          ↪
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;