import React, { useEffect, useState } from "react";
import "../styles/timer.css";

function FocusTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formatTime = (value) => {
    return String(value).padStart(2, "0");
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(25 * 60);
  };

  return (
    <section className="timer-card">

      <div className="timer-header">
        <div>
          <h3>Focus Timer</h3>
          <p>Stay focused on your current task</p>
        </div>

        <span className="timer-icon">⏱</span>
      </div>

      <div className="timer-display">
        {formatTime(minutes)}:{formatTime(remainingSeconds)}
      </div>

      <p className="timer-status">
        {isRunning ? "Focus session in progress..." : "Ready to focus?"}
      </p>

      <div className="timer-actions">

        <button
          className="timer-start-btn"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? "⏸ Pause" : "▶ Start"}
        </button>

        <button
          className="timer-reset-btn"
          onClick={handleReset}
        >
          ↻ Reset
        </button>

      </div>

    </section>
  );
}

export default FocusTimer;