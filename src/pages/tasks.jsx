import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/tasks-page.css";

function Tasks() {
  // Tasks
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");

  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Search + Filter
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
      console.log("Fetch Tasks Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setPriority("Medium");
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
      if (editingId) {
        // UPDATE TASK
        await API.put(`/tasks/${editingId}`, {
          title,
          description,
          status,
          priority,
        });

        setMessage("Task updated successfully");
      } else {
        // CREATE TASK
        await API.post("/tasks", {
          title,
          description,
          status,
          priority,
        });

        setMessage("Task added successfully");
      }

      resetForm();

      await fetchTasks();
    } catch (error) {
      console.log("Task Save Error:", error);

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

      setMessage("Task deleted successfully");

      if (editingId === id) {
        resetForm();
      }

      await fetchTasks();
    } catch (error) {
      console.log("Delete Task Error:", error);

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
  // SEARCH + FILTER
  // =========================

  const filteredTasks = tasks.filter((task) => {
    // Search using task title
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "All" ||
      task.status === statusFilter;

    // Priority filter
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

        {/* Add / Update Button */}

        <button
          className="add-task-button"
          type="submit"
        >
          {editingId
            ? "Update Task"
            : "+ Add Task"}
        </button>

        {/* Cancel Edit */}

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


        {/* =========================
            SEARCH + FILTER
        ========================== */}

        <div className="task-filters">

          {/* Search */}

          <input
            type="text"
            className="task-search"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />


          {/* Status Filter */}

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


          {/* Priority Filter */}

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


        {/* =========================
            TASK CARDS
        ========================== */}

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

              {/* Task Title */}

              <h3>
                {task.title}
              </h3>


              {/* Description */}

              <p>
                {task.description}
              </p>


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