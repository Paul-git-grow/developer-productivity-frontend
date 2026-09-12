import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/tasks-page.css";

function Tasks() {
  // =========================
  // TASK DATA
  // =========================

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // ADD / EDIT FORM
  // =========================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [project, setProject] = useState("");

  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  // =========================
  // SEARCH + FILTER
  // =========================

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // =========================
  // GET TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      const response = await API.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.log(
        "Fetch Tasks Error:",
        error.response?.data || error.message
      );
    }
  };

  // =========================
  // GET PROJECTS
  // =========================

  const fetchProjects = async () => {
    try {
      const response = await API.get("/projects");
      setProjects(response.data);
    } catch (error) {
      console.log(
        "Fetch Projects Error:",
        error.response?.data || error.message
      );
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([
        fetchTasks(),
        fetchProjects(),
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setPriority("Medium");
    setDueDate("");
    setProject("");
    setEditingId(null);
  };

  // =========================
  // ADD / UPDATE TASK
  // =========================

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("Task title is required");
      return;
    }

    try {
      const taskData = {
        title,
        description,
        status,
        priority,
        dueDate: dueDate || null,
        project: project || null,
      };

      if (editingId) {
        // UPDATE TASK
        await API.put(
          `/tasks/${editingId}`,
          taskData
        );

        setMessage("Task updated successfully");
      } else {
        // CREATE TASK
        await API.post(
          "/tasks",
          taskData
        );

        setMessage("Task added successfully");
      }

      resetForm();

      await fetchTasks();

    } catch (error) {
      console.log(
        "Task Save Error:",
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.message ||
          "Task operation failed"
      );
    }
  };

  // =========================
  // EDIT TASK
  // =========================

  const handleEditTask = (task) => {
    setEditingId(task._id);

    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setPriority(task.priority);

    setProject(
      task.project?._id ||
      task.project ||
      ""
    );

    setDueDate(
      task.dueDate
        ? new Date(task.dueDate)
            .toISOString()
            .split("T")[0]
        : ""
    );

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE TASK
  // =========================

  const handleDeleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/tasks/${id}`);

      setMessage(
        "Task deleted successfully"
      );

      if (editingId === id) {
        resetForm();
      }

      await fetchTasks();

    } catch (error) {
      console.log(
        "Delete Task Error:",
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.message ||
          "Task delete failed"
      );
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancelEdit = () => {
    resetForm();
    setMessage("");
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDueDate = (date) => {
    if (!date) return "No due date";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="tasks-page">
        <h2>Loading tasks...</h2>
      </div>
    );
  }

  return (
    <div className="tasks-page">

      {/* PAGE TITLE */}

      <h1>Tasks</h1>

      {/* =========================
          ADD / EDIT TASK FORM
      ========================== */}

      <form
        className="task-form"
        onSubmit={handleAddTask}
      >

        <h2>
          {editingId
            ? "Edit Task"
            : "Add New Task"}
        </h2>

        {/* Title */}

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        {/* Description */}

        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        {/* Status */}

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="Pending">
            Pending
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>

        {/* Priority */}

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
        >
          <option value="Low">
            Low
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="High">
            High
          </option>
        </select>

        {/* Project Assignment */}

        <select
          value={project}
          onChange={(e) =>
            setProject(e.target.value)
          }
        >
          <option value="">
            Select Project
          </option>

          {projects.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {item.name}
            </option>
          ))}
        </select>

        {/* Due Date */}

        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />

        {/* Add / Update Button */}

        <button
          className="add-task-button"
          type="submit"
        >
          {editingId
            ? "Update Task"
            : "+ Add Task"}
        </button>

        {/* Cancel */}

        {editingId && (
          <button
            className="cancel-task-button"
            type="button"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        )}

        {/* Message */}

        {message && (
          <p className="task-message">
            {message}
          </p>
        )}

      </form>

      {/* =========================
          MY TASKS
      ========================== */}

      <div className="task-list-section">

        <h2>My Tasks</h2>

        {/* SEARCH + FILTER */}

        <div className="task-filters">

          <input
            type="text"
            className="task-search"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          <select
            className="task-filter-select"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>

          <select
            className="task-filter-select"
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
          >
            <option value="All">
              All Priority
            </option>

            <option value="Low">
              Low
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">
              High
            </option>
          </select>

        </div>

        {/* TASK CARDS */}

        {filteredTasks.length === 0 ? (

          <div className="tasks-empty">

            <p>
              {tasks.length === 0
                ? "No tasks found"
                : "No matching tasks found"}
            </p>

          </div>

        ) : (

          filteredTasks.map((task) => (

            <div
              className="task-card"
              key={task._id}
            >

              <h3>
                {task.title}
              </h3>

              <p>
                {task.description ||
                  "No description"}
              </p>

              {/* Project + Due Date */}

              <div className="task-extra-info">

                <p>
                  <strong>
                    Project:
                  </strong>{" "}
                  {task.project?.name ||
                    "No Project"}
                </p>

                <p>
                  <strong>
                    Due Date:
                  </strong>{" "}
                  {formatDueDate(
                    task.dueDate
                  )}
                </p>

              </div>

              {/* Status + Priority */}

              <div className="task-meta">

                <span className="task-status">
                  {task.status}
                </span>

                <span className="task-priority">
                  {task.priority}
                </span>

              </div>

              {/* Actions */}

              <div className="task-actions">

                <button
                  className="edit-task-button"
                  onClick={() =>
                    handleEditTask(task)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-task-button"
                  onClick={() =>
                    handleDeleteTask(task._id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Tasks;