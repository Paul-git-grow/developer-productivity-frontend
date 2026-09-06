import React from "react";
import "../styles/dashboard.css";

function StatCard({ icon, title, value, description }) {
  return (
    <div className="stat-card">

      <div className="stat-card-top">
        <div className="stat-icon">
          {icon}
        </div>

        <span className="stat-menu">⋮</span>
      </div>

      <div className="stat-content">
        <p>{title}</p>

        <h2>{value}</h2>

        <span>{description}</span>
      </div>

    </div>
  );
}

export default StatCard;