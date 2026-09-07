import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/analytics-page.css";

function Analytics() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [focusSeconds, setFocusSeconds] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await API.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        console.log(
          "Analytics Error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);


  useEffect(() => {
  const updateFocusTime = () => {
    const savedFocusSeconds = Number(
      localStorage.getItem("totalFocusSeconds") || 0
    );

    setFocusSeconds(savedFocusSeconds);
  };

  updateFocusTime();

  const interval = setInterval(updateFocusTime, 1000);

  return () => clearInterval(interval);
}, []);


const focusHours = Math.floor(focusSeconds / 3600);

const focusMinutes = Math.floor(
  (focusSeconds % 3600) / 60
);

const focusRemainingSeconds = focusSeconds % 60;

const formattedFocusTime =
  focusHours > 0
    ? `${focusHours}h ${focusMinutes}m`
    : focusMinutes > 0
    ? `${focusMinutes}m ${focusRemainingSeconds}s`
    : `${focusRemainingSeconds}s`;


  // =========================
  // BASIC STATISTICS
  // =========================

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

  const completionRate =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  const productivityScore = completionRate;

  // =========================
  // WEEKLY PERFORMANCE
  // =========================

  const days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const weeklyData = days.map((day, index) => {
    const dayTasks = tasks.filter((task) => {
      if (!task.createdAt) return false;

      const date = new Date(task.createdAt);

      return date.getDay() === index;
    });

    const dayCompleted = dayTasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const value =
      dayTasks.length > 0
        ? Math.round(
            (dayCompleted / dayTasks.length) * 100
          )
        : 0;

    return {
      day,
      value,
    };
  });

  // Monday → Sunday

  const orderedWeeklyData = [
    weeklyData[1],
    weeklyData[2],
    weeklyData[3],
    weeklyData[4],
    weeklyData[5],
    weeklyData[6],
    weeklyData[0],
  ];

  // =========================
  // TASK DISTRIBUTION
  // =========================

  const getPercentage = (count) => {
    if (totalTasks === 0) return 0;

    return Math.round((count / totalTasks) * 100);
  };

  const distribution = [
    {
      name: "Completed",
      count: completedTasks,
      percentage: getPercentage(completedTasks),
    },
    {
      name: "In Progress",
      count: inProgressTasks,
      percentage: getPercentage(inProgressTasks),
    },
    {
      name: "Pending",
      count: pendingTasks,
      percentage: getPercentage(pendingTasks),
    },
  ];

  if (loading) {
    return (
      <div className="analytics-page">
        <h2>Loading analytics...</h2>
      </div>
    );
  }

  return (
    <div className="analytics-page">

      {/* ================= HEADER ================= */}

      <div className="analytics-header">

        <div>
          <h1>Analytics</h1>

          <p>
            Understand your productivity and track your
            progress.
          </p>
        </div>

        <select>
          <option>This Week</option>
        </select>

      </div>


      {/* ================= STAT CARDS ================= */}

      <div className="analytics-stats">

        <div className="analytics-stat-card">

          <div className="analytics-stat-top">
            <span>Productivity Score</span>
            <span className="analytics-icon">📈</span>
          </div>

          <h2>{productivityScore}%</h2>

          <p>
            Based on completed tasks
          </p>

        </div>


        <div className="analytics-stat-card">

          <div className="analytics-stat-top">
            <span>Tasks Completed</span>
            <span className="analytics-icon">✓</span>
          </div>

          <h2>{completedTasks}</h2>

          <p>
            {completedTasks} of {totalTasks} completed
          </p>

        </div>


        <div className="analytics-stat-card">

  <div className="analytics-stat-top">
    <span>Focus Time</span>
    <span className="analytics-icon">⏱</span>
  </div>

  <h2>{formattedFocusTime}</h2>

  <p>
    {focusSeconds > 0
      ? "Total focused time"
      : "Start Focus Timer to track time"}
  </p>

</div>


        <div className="analytics-stat-card">

          <div className="analytics-stat-top">
            <span>Completion Rate</span>
            <span className="analytics-icon">🎯</span>
          </div>

          <h2>{completionRate}%</h2>

          <p>
            Current task completion rate
          </p>

        </div>

      </div>


      {/* ================= MAIN ANALYTICS ================= */}

      <div className="analytics-main">

        {/* WEEKLY PERFORMANCE */}

        <div className="weekly-performance-card">

          <div className="analytics-card-header">

            <h2>Weekly Performance</h2>

            <p>
              Your productivity score for each day.
            </p>

          </div>


          <div className="analytics-chart">

            {orderedWeeklyData.map((item) => (

              <div
                className="analytics-bar-item"
                key={item.day}
              >

                <span className="analytics-bar-value">
                  {item.value}%
                </span>

                <div className="analytics-bar-track">

                  <div
                    className="analytics-bar-fill"
                    style={{
                      height: `${item.value}%`,
                    }}
                  />

                </div>

                <span className="analytics-day">
                  {item.day}
                </span>

              </div>

            ))}

          </div>

        </div>


        {/* TASK DISTRIBUTION */}

        <div className="task-distribution-card">

          <div className="analytics-card-header">

            <h2>Task Distribution</h2>

            <p>
              Tasks by current status.
            </p>

          </div>


          <div className="distribution-list">

            {distribution.map((item) => (

              <div
                className="distribution-item"
                key={item.name}
              >

                <div className="distribution-info">

                  <span>{item.name}</span>

                  <strong>
                    {item.percentage}%
                  </strong>

                </div>

                <div className="distribution-track">

                  <div
                    className="distribution-fill"
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />

                </div>

                <small>
                  {item.count} tasks
                </small>

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* ================= INSIGHT ================= */}

      <div className="analytics-insight">

        <div className="insight-icon">
          💡
        </div>

        <div>
          <h3>Productivity Summary</h3>

          {totalTasks === 0 ? (
            <p>
              Create tasks to start tracking your
              productivity.
            </p>
          ) : (
            <p>
              You have completed {completedTasks} out of{" "}
              {totalTasks} tasks. Your current productivity
              score is {productivityScore}%.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default Analytics;