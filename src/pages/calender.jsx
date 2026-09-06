import React, { useState } from "react";
import "../styles/calendar.css";

function Calendar() {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(
    today.getDate()
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const previousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
    setSelectedDate(1);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
    setSelectedDate(1);
  };

  const goToToday = () => {
    setCurrentDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

    setSelectedDate(today.getDate());
  };

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const tasks = {
    3: [
      {
        title: "Complete React project",
        time: "10:00 AM",
      },
    ],

    8: [
      {
        title: "Team meeting",
        time: "11:30 AM",
      },
      {
        title: "Learn Node.js",
        time: "03:00 PM",
      },
    ],

    15: [
      {
        title: "Build dashboard",
        time: "09:00 AM",
      },
    ],

    22: [
      {
        title: "Portfolio update",
        time: "02:00 PM",
      },
    ],
  };

  const selectedTasks = tasks[selectedDate] || [];

  return (
    <div className="calendar-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="calendar-header">

        <div>
          <h2>Calendar</h2>

          <p>
            Plan and organize your schedule.
          </p>
        </div>

        <button
          className="today-btn"
          onClick={goToToday}
        >
          Today
        </button>

      </div>


      {/* =========================
          CALENDAR LAYOUT
      ========================= */}

      <div className="calendar-layout">

        {/* Calendar */}

        <div className="calendar-card">

          {/* Month Header */}

          <div className="calendar-top">

            <button
              className="month-arrow"
              onClick={previousMonth}
            >
              ←
            </button>

            <h3>
              {monthName} {year}
            </h3>

            <button
              className="month-arrow"
              onClick={nextMonth}
            >
              →
            </button>

          </div>


          {/* Week Days */}

          <div className="week-days">

            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (
              <div key={day}>
                {day}
              </div>
            ))}

          </div>


          {/* Dates */}

          <div className="calendar-grid">

            {/* Empty cells */}

            {Array.from({
              length: firstDay,
            }).map((_, index) => (
              <div
                className="calendar-day empty"
                key={`empty-${index}`}
              ></div>
            ))}


            {/* Days */}

            {Array.from({
              length: daysInMonth,
            }).map((_, index) => {

              const day = index + 1;

              const hasTask =
                tasks[day] &&
                tasks[day].length > 0;

              return (
                <button
                  key={day}
                  className={`
                    calendar-day
                    ${
                      selectedDate === day
                        ? "selected"
                        : ""
                    }
                    ${
                      isToday(day)
                        ? "today"
                        : ""
                    }
                  `}
                  onClick={() =>
                    setSelectedDate(day)
                  }
                >

                  <span className="day-number">
                    {day}
                  </span>

                  {hasTask && (
                    <span className="task-dot"></span>
                  )}

                </button>
              );
            })}

          </div>

        </div>


        {/* =========================
            SELECTED DATE
        ========================= */}

        <div className="schedule-card">

          <div className="schedule-header">

            <div>
              <span>
                Selected Date
              </span>

              <h3>
                {monthName} {selectedDate}
              </h3>
            </div>

            <button className="add-schedule-btn">
              +
            </button>

          </div>


          {/* Tasks */}

          <div className="schedule-list">

            {selectedTasks.length === 0 ? (

              <div className="no-schedule">

                <div>
                  📅
                </div>

                <h4>
                  No schedules
                </h4>

                <p>
                  Nothing planned for this day.
                </p>

              </div>

            ) : (

              selectedTasks.map(
                (task, index) => (

                  <div
                    className="schedule-item"
                    key={index}
                  >

                    <div className="schedule-time">
                      {task.time}
                    </div>

                    <div className="schedule-line"></div>

                    <div className="schedule-info">

                      <h4>
                        {task.title}
                      </h4>

                      <span>
                        Scheduled Task
                      </span>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Calendar;