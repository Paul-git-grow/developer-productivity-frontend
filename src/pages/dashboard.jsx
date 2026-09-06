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

  if (loading) {
    return (
      <div className="dashboard-page">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* Welcome Section */}

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


      {/* Stats */}

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


      {/* Today's Tasks + Focus Timer */}

      <section className="dashboard-main-grid">

        <TaskList
          tasks={tasks}
          refreshTasks={fetchTasks}
          setActivePage={setActivePage}
        />

        <FocusTimer />

      </section>


      {/* Weekly Productivity */}

      <ProductivityChart tasks={tasks} />


      {/* Quick Actions */}

      <QuickActions />

    </div>
  );
}

export default Dashboard;