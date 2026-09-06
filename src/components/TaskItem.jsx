import React from "react";

function TaskItem({ task, onToggle }) {
  return (
    <div
      className={`task-item ${
        task.completed ? "completed" : ""
      }`}
    >

      <button
        className="task-checkbox"
        onClick={() => onToggle(task.id)}
      >
        {task.completed ? "✓" : ""}
      </button>

      <div className="task-info">

        <h4>{task.title}</h4>

        <div className="task-meta">
          <span>{task.category}</span>
          <span>•</span>
          <span>{task.time}</span>
        </div>

      </div>

      <span
        className={`priority priority-${task.priority.toLowerCase()}`}
      >
        {task.priority}
      </span>

      <button className="task-menu">
        ⋮
      </button>

    </div>
  );
}

export default TaskItem;