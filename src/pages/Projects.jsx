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
  // CREATE PROJECT FORM
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

      // Reset form
      setName("");
      setDescription("");
      setStatus("Planning");
      setProgress(0);

      // Reload projects
      await fetchProjects();

      // Close form after success
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
  // SEARCH + FILTER LOGIC
  // =========================

  const filteredProjects = projects.filter((project) => {
    // Search project by name
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter project by status
    const matchesStatus =
      statusFilter === "All" ||
      project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // LOADING STATE
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

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="projects-header">

        <div>
          <h1>Projects</h1>

          <p>
            Manage and track your projects.
          </p>
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


      {/* =========================
          SEARCH + FILTER
      ========================== */}

      <div className="project-filters">

        {/* Search */}

        <input
          type="text"
          className="project-search"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />


        {/* Status Filter */}

        <select
          className="project-filter-select"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">
            All Status
          </option>

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

      </div>


      {/* =========================
          CREATE PROJECT MODAL
      ========================== */}

      {showForm && (

        <div className="project-form-overlay">

          <div className="project-form-box">

            {/* Modal Header */}

            <div className="project-form-header">

              <h2>
                Create Project
              </h2>

              <button
                type="button"
                className="close-project-form"
                onClick={handleCloseForm}
              >
                ×
              </button>

            </div>


            {/* Create Project Form */}

            <form onSubmit={handleCreateProject}>

              {/* Project Name */}

              <label>
                Project Name
              </label>

              <input
                type="text"
                placeholder="Enter project name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />


              {/* Description */}

              <label>
                Description
              </label>

              <textarea
                placeholder="Enter project description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />


              {/* Status */}

              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
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


              {/* Progress */}

              <label>
                Progress
              </label>

              <input
                type="number"
                min="0"
                max="100"
                placeholder="0 - 100"
                value={progress}
                onChange={(e) =>
                  setProgress(e.target.value)
                }
              />


              {/* Submit */}

              <button
                type="submit"
                className="submit-project-btn"
              >
                Create Project
              </button>


              {/* Message */}

              {message && (
                <p className="project-form-message">
                  {message}
                </p>
              )}

            </form>

          </div>

        </div>

      )}


      {/* =========================
          PROJECT LIST
      ========================== */}

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

              {/* Project Name */}

              <h3>
                {project.name}
              </h3>


              {/* Description */}

              <p>
                {project.description ||
                  "No description"}
              </p>


              {/* Status */}

              <span>
                {project.status}
              </span>


              {/* Progress Information */}

              <div className="project-progress-info">

                <p>
                  Progress
                </p>

                <strong>
                  {project.progress}%
                </strong>

              </div>


              {/* Progress Bar */}

              <div className="project-progress">

                <div
                  className="project-progress-bar"
                  style={{
                    width: `${project.progress}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Projects;