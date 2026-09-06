import React from "react";
import "../styles/productivityChart.css";

function ProductivityChart({ tasks = [] }) {
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

      const taskDate = new Date(task.createdAt);

      return taskDate.getDay() === index;
    });

    const completedTasks = dayTasks.filter(
      (task) => task.status === "Completed"
    );

    const percentage =
      dayTasks.length > 0
        ? Math.round(
            (completedTasks.length / dayTasks.length) *
              100
          )
        : 0;

    return {day,percentage,total: dayTasks.length,completed: completedTasks.length,};
  });

  // Monday first, Sunday last
  const orderedWeeklyData = [
    weeklyData[1],
    weeklyData[2],
    weeklyData[3],
    weeklyData[4],
    weeklyData[5],
    weeklyData[6],
    weeklyData[0],
  ];

  return (
    <section className="productivity-card">

      {/* Header */}

      <div className="productivity-header">

        <div>
          <h3>Weekly Productivity</h3>

          <p> Track your productivity throughout the week. </p>
        </div>

        <select>
          <option>This Week</option>
        </select>

      </div>


      {/* Chart */}

      <div className="weekly-chart">

        {orderedWeeklyData.map((item) => (

          <div className="weekly-bar-item" key={item.day}>

            {/* Percentage */}

            <span className="weekly-percentage">
              {item.percentage}%
            </span>


            {/* Bar Background */}

            <div className="weekly-bar-track">

              {/* Actual Bar */}

              <div
                className="weekly-bar-fill"
                style={{
                  height: `${item.percentage}%`,
                }}
              />

            </div>


            {/* Day */}

            <span className="weekly-day">
              {item.day}
            </span>

          </div>

        ))}

      </div>

    </section>
  );
}

export default ProductivityChart;