import React from "react";
import "../styles/dashboard.css";

function QuickActions() {
  return (
    <section className="quick-actions-card">

      <div className="quick-actions-header">
        <div>
          <h3>Quick Actions</h3>
          <p>Get things done faster</p>
        </div>
      </div>

      <div className="quick-actions-grid">

        <button className="quick-action">
          <span className="quick-action-icon">＋</span>

          <div>
            <strong>Add Task</strong>
            <small>Create a new task</small>
          </div>
        </button>

        <button className="quick-action">
          <span className="quick-action-icon">🎯</span>

          <div>
            <strong>Start Focus</strong>
            <small>Start a focus session</small>
          </div>
        </button>

        <button className="quick-action">
          <span className="quick-action-icon">📅</span>

          <div>
            <strong>Calendar</strong>
            <small>View your schedule</small>
          </div>
        </button>

      </div>

    </section>
  );
}

export default QuickActions;