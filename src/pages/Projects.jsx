import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Projects.css";

function Projects() {
  // =========================
  // PROJECT DATA
  // =========================

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // CREATE PROJECT
  // =========================

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Planning");
  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState("");

  // =========================
  // SEARCH + FILTER
  // =========================

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =========================
  // VIEW PROJECT
  // =========================

  const [selectedProject, setSelectedProject] = useState(null);

  // =========================
  // EDIT PROJECT
  // =========================

  const [editingProject, setEditingProject] = useState(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("Planning");
  const [editProgress, setEditProgress] = useState(0);

  // =========================
  // GET PROJECTS
  // =========================

  const fetchProjects = async () => {
    try {
      const response = await API.get("/projects");
      setProjects(response.data);
    } catch (error) {
      console.log(
        "Project Fetch Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // =========================
  // CREATE PROJECT
  // =========================

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Project name is required");
      return;
    }

    try {
      await API.post("/projects", {
        name,
        description,
        status,
        progress: Number(progress),
      });

      setMessage("Project created successfully");

      setName("");
      setDescription("");
      setStatus("Planning");
      setProgress(0);

      await fetchProjects();

      setTimeout(() => {
        setShowForm(false);
        setMessage("");
      }, 800);
    } catch (error) {
      console.log(
        "Project Create Error:",
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.message ||
          "Project creation failed"
      );
    }
  };

  // =========================
  // CLOSE CREATE FORM
  // =========================

  const handleCloseForm = () => {
    setShowForm(false);
    setMessage("");

    setName("");
    setDescription("");
    setStatus("Planning");
    setProgress(0);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================

  const handleEditClick = (project) => {
    setEditingProject(project);

    setEditName(project.name);
    setEditDescription(project.description || "");
    setEditStatus(project.status);
    setEditProgress(project.progress);
  };

  // =========================
  // UPDATE PROJECT
  // =========================

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    if (!editName.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      await API.put(`/projects/${editingProject._id}`, {
        name: editName,
        description: editDescription,
        status: editStatus,
        progress: Number(editProgress),
      });

      alert("Project updated successfully");

      setEditingProject(null);

      await fetchProjects();
    } catch (error) {
      console.log(
        "Project Update Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Project update failed"
      );
    }
  };

  // =========================
  // DELETE PROJECT
  // =========================

  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`/projects/${projectId}`);

      alert("Project deleted successfully");

      await fetchProjects();
    } catch (error) {
      console.log(
        "Project Delete Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Project deletion failed"
      );
    }
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="projects-page">
        <h2>Loading projects...</h2>
      </div>
    );
  }

  return (
    <div className="projects-page">

      {/* PAGE HEADER */}

      <div className="projects-header">
        <div>
          <h1>Projects</h1>
          <p>Manage and track your projects.</p>
        </div>

        <button
          type="button"
          className="create-project-btn"
          onClick={() => {
            setShowForm(true);
            setMessage("");
          }}
        >
          + Create Project
        </button>
      </div>

      {/* SEARCH + FILTER */}

      <div className="project-filters">

        <input
          type="text"
          className="project-search"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

        <select
          className="project-filter-select"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">All Status</option>
          <option value="Planning">Planning</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

      </div>

      {/* CREATE PROJECT MODAL */}

      {showForm && (
        <div className="project-form-overlay">

          <div className="project-form-box">

            <div className="project-form-header">

              <h2>Create Project</h2>

              <button
                type="button"
                className="close-project-form"
                onClick={handleCloseForm}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleCreateProject}>

              <label>Project Name</label>

              <input
                type="text"
                placeholder="Enter project name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

              <label>Description</label>

              <textarea
                placeholder="Enter project description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

              <label>Status</label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Completed">
                  Completed
                </option>
              </select>

              <label>Progress</label>

              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) =>
                  setProgress(e.target.value)
                }
              />

              <button
                type="submit"
                className="submit-project-btn"
              >
                Create Project
              </button>

              {message && (
                <p className="project-form-message">
                  {message}
                </p>
              )}

            </form>

          </div>
        </div>
      )}

      {/* PROJECT LIST */}

      {filteredProjects.length === 0 ? (

        <div className="projects-empty">

          <h3>
            {projects.length === 0
              ? "No projects yet"
              : "No matching projects"}
          </h3>

          <p>
            {projects.length === 0
              ? "Create your first project to get started."
              : "Try changing your search or status filter."}
          </p>

        </div>

      ) : (

        <div className="projects-grid">

          {filteredProjects.map((project) => (

            <div
              className="project-card"
              key={project._id}
            >

              <h3>{project.name}</h3>

              <p>
                {project.description ||
                  "No description"}
              </p>

              <span className="project-status">
                {project.status}
              </span>

              <div className="project-progress-info">

                <p>Progress</p>

                <strong>
                  {project.progress}%
                </strong>

              </div>

              <div className="project-progress">

                <div
                  className="project-progress-bar"
                  style={{
                    width: `${project.progress}%`,
                  }}
                />

              </div>

              {/* ACTION BUTTONS */}

              <div className="project-actions">

                <button
                  className="view-project-btn"
                  onClick={() =>
                    setSelectedProject(project)
                  }
                >
                  View
                </button>

                <button
                  className="edit-project-btn"
                  onClick={() =>
                    handleEditClick(project)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-project-btn"
                  onClick={() =>
                    handleDeleteProject(project._id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* VIEW PROJECT MODAL */}

      {selectedProject && (

        <div className="project-form-overlay">

          <div className="project-details-box">

            <div className="project-form-header">

              <h2>Project Details</h2>

              <button
                className="close-project-form"
                onClick={() =>
                  setSelectedProject(null)
                }
              >
                ×
              </button>

            </div>

            <div className="project-details-content">

              <p>
                <strong>Name:</strong>{" "}
                {selectedProject.name}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {selectedProject.description ||
                  "No description"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedProject.status}
              </p>

              <p>
                <strong>Progress:</strong>{" "}
                {selectedProject.progress}%
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {selectedProject.createdAt
                  ? new Date(
                      selectedProject.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

            </div>

          </div>

        </div>

      )}

      {/* EDIT PROJECT MODAL */}

      {editingProject && (

        <div className="project-form-overlay">

          <div className="project-form-box">

            <div className="project-form-header">

              <h2>Edit Project</h2>

              <button
                className="close-project-form"
                onClick={() =>
                  setEditingProject(null)
                }
              >
                ×
              </button>

            </div>

            <form onSubmit={handleUpdateProject}>

              <label>Project Name</label>

              <input
                type="text"
                value={editName}
                onChange={(e) =>
                  setEditName(e.target.value)
                }
                required
              />

              <label>Description</label>

              <textarea
                value={editDescription}
                onChange={(e) =>
                  setEditDescription(e.target.value)
                }
              />

              <label>Status</label>

              <select
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value)
                }
              >
                <option value="Planning">
                  Planning
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>

              <label>Progress</label>

              <input
                type="number"
                min="0"
                max="100"
                value={editProgress}
                onChange={(e) =>
                  setEditProgress(e.target.value)
                }
              />

              <button
                type="submit"
                className="submit-project-btn"
              >
                Update Project
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Projects;