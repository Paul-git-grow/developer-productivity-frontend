import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import TaskList from "../components/TaskList";
import FocusTimer from "../components/FocusTimer";
import ProductivityChart from "../components/ProductivityChart";
import QuickActions from "../components/QuickActions";
import API from "../services/api";
import "../styles/dashboard.css";

function Dashboard({ setActivePage }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await API.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.log(
        "Dashboard Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ==============================
  // TASK STATISTICS
  // ==============================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const productivity =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  // ==============================
  // RECENT ACTIVITY
  // ==============================

  const recentActivities = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    )
    .slice(0, 5);

  const formatActivityDate = (date) => {
    if (!date) return "";

    const activityDate = new Date(date);

    return activityDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (status) => {
    if (status === "Completed") {
      return "✅";
    }

    if (status === "In Progress") {
      return "🔄";
    }

    return "⏳";
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* ==============================
          Welcome Section
      ============================== */}

      <section className="welcome-section">
        <div>
          <h2>Good Morning, Paul 👋</h2>

          <p>
            Stay focused and make today productive.
          </p>
        </div>

        <button
          className="add-task-btn"
          onClick={() => setActivePage("Tasks")}
        >
          + Add Task
        </button>
      </section>


      {/* ==============================
          Statistics
      ============================== */}

      <section className="stats-grid">

        <StatCard
          icon="📋"
          title="Total Tasks"
          value={totalTasks}
          description={`${totalTasks - completedTasks} tasks remaining`}
        />

        <StatCard
          icon="✓"
          title="Completed"
          value={completedTasks}
          description={`${completedTasks} tasks completed`}
        />

        <StatCard
          icon="⏳"
          title="Pending"
          value={pendingTasks}
          description={`${inProgressTasks} in progress`}
        />

        <StatCard
          icon="📈"
          title="Productivity"
          value={`${productivity}%`}
          description="Based on completed tasks"
        />

      </section>


      {/* ==============================
          Today's Tasks + Focus Timer
      ============================== */}

      <section className="dashboard-main-grid">

        <TaskList
          tasks={tasks}
          refreshTasks={fetchTasks}
          setActivePage={setActivePage}
        />

        <FocusTimer />

      </section>


      {/* ==============================
          Weekly Productivity
      ============================== */}

      <ProductivityChart tasks={tasks} />


      {/* ==============================
          Recent Activity
      ============================== */}

      <section className="recent-activity-card">

        <div className="recent-activity-header">
          <div>
            <h3>Recent Activity</h3>
            <p>Your latest task updates</p>
          </div>

          <button
            className="view-all-activity-btn"
            onClick={() => setActivePage("Tasks")}
          >
            View All
          </button>
        </div>

        <div className="recent-activity-list">

          {recentActivities.length > 0 ? (

            recentActivities.map((task) => (

              <div
                className="recent-activity-item"
                key={task._id}
              >

                <div className="activity-left">

                  <div className="activity-icon">
                    {getActivityIcon(task.status)}
                  </div>

                  <div className="activity-info">

                    <h4>{task.title}</h4>

                    <p>
                      {task.project?.name
                        ? task.project.name
                        : "General Task"}
                    </p>

                  </div>

                </div>


                <div className="activity-right">

                  <span
                    className={`activity-status ${
                      task.status === "Completed"
                        ? "activity-completed"
                        : task.status === "In Progress"
                        ? "activity-progress"
                        : "activity-pending"
                    }`}
                  >
                    {task.status}
                  </span>

                  <span className="activity-date">
                    {formatActivityDate(
                      task.updatedAt || task.createdAt
                    )}
                  </span>

                </div>

              </div>

            ))

          ) : (

            <div className="activity-empty">

              <span>📋</span>

              <h4>No recent activity</h4>

              <p>
                Create or update a task to see activity here.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* ==============================
          Quick Actions
      ============================== */}

      <QuickActions />

    </div>
  );
}

export default Dashboard;