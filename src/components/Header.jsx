import React, { useEffect, useState } from "react";
import "../styles/header.css";

function Header() {
  const [user, setUser] = useState({
    name: "",
    role: "",
  });

  // Get currently logged-in user
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        setUser({
          name: parsedUser.name || "",
          role: parsedUser.role || "Developer",
        });
      } catch (error) {
        console.log("User data error:", error);
      }
    }
  }, []);

  // First letter for avatar
  const avatarLetter = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <header className="header">

      {/* Header Title */}
      <div className="header-title">
        <h1>Dashboard</h1>
        <p>
          Here's what's happening with your productivity today.
        </p>
      </div>

      {/* Header Actions */}
      <div className="header-actions">

        {/* Search */}
        <div className="search-box">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search..."
          />

          <span className="search-key">
            Ctrl K
          </span>
        </div>

        {/* Notification */}
        <button className="notification-button">
          🔔
          <span className="notification-dot"></span>
        </button>

        {/* Dynamic User Profile */}
        <div className="header-profile">

          <div className="header-avatar">
            {avatarLetter}
          </div>

          <div className="header-user-info">
            <h4>{user.name || "User"}</h4>
            <p>{user.role || "Developer"}</p>
          </div>

          <span className="profile-arrow">⌄</span>

        </div>

      </div>

    </header>
  );
}

export default Header;