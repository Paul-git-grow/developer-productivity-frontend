import React from "react";
import API from "../services/api";
import "../styles/tasklist.css";

function TaskList({ tasks = [], refreshTasks, setActivePage }) {
  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const progress =
    tasks.length > 0
      ? (completedCount / tasks.length) * 100
      : 0;

  const handleToggle = async (task) => {
    try {
      const newStatus =
        task.status === "Completed"
          ? "Pending"
          : "Completed";

      await API.put(`/tasks/${task._id}`, {
        status: newStatus,
      });

      if (refreshTasks) {
        await refreshTasks();
      }
    } catch (error) {
      console.log(
        "Task update error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <section className="tasks-card">

      <div className="today-tasks-header">

        <div>
          <h3>Today's Tasks</h3>
          <p>
            {completedCount} of {tasks.length} tasks completed
          </p>
        </div>

        <button
          className="view-all-btn"
          onClick={() => setActivePage("Tasks")}
        >
          View All
        </button>

      </div>

      <div className="task-progress">
        <div
          className="task-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="today-task-list">

        {tasks.length === 0 ? (
          <p className="today-empty">
            No tasks available.
          </p>
        ) : (
          tasks.slice(0, 5).map((task) => {
            const completed =
              task.status === "Completed";

            return (
              <div
                className={`today-task-row ${
                  completed ? "completed" : ""
                }`}
                key={task._id}
              >

                <button
                  type="button"
                  className={`today-checkbox ${
                    completed ? "checked" : ""
                  }`}
                  onClick={() => handleToggle(task)}
                >
                  {completed ? "✓" : ""}
                </button>

                <div className="today-task-content">

                  <h4>{task.title}</h4>

                  <div className="today-task-meta">
                    <span>{task.status}</span>
                    <span>•</span>
                    <span>{task.priority}</span>
                  </div>

                </div>

                <span
                  className={`today-priority ${task.priority
                    ?.toLowerCase()}`}
                >
                  {task.priority}
                </span>

              </div>
            );
          })
        )}

      </div>

    </section>
  );
}

export default TaskList;