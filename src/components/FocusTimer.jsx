import React, { useEffect, useState } from "react";
import "../styles/timer.css";

const FOCUS_TIME = 25 * 60;

function FocusTimer() {
  const [seconds, setSeconds] = useState(() => {
    const endTime = localStorage.getItem("focusEndTime");

    if (endTime) {
      const remaining = Math.ceil(
        (Number(endTime) - Date.now()) / 1000
      );

      return remaining > 0 ? remaining : FOCUS_TIME;
    }

    const savedSeconds = localStorage.getItem("focusSeconds");

    return savedSeconds
      ? Number(savedSeconds)
      : FOCUS_TIME;
  });

  const [isRunning, setIsRunning] = useState(() => {
    const endTime = localStorage.getItem("focusEndTime");

    return Boolean(
      endTime && Number(endTime) > Date.now()
    );
  });

  // ==========================================
  // TIMER
  // ==========================================

  useEffect(() => {
    if (!isRunning) return;

    const updateTimer = () => {
      const endTime = Number(
        localStorage.getItem("focusEndTime")
      );

      if (!endTime) return;

      const remaining = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      );

      setSeconds(remaining);

      localStorage.setItem(
        "focusSeconds",
        String(remaining)
      );

      // Total focused seconds
      const lastUpdate = Number(
        localStorage.getItem("focusLastUpdate")
      );

      const now = Date.now();

      if (lastUpdate) {
        const elapsed = Math.floor(
          (now - lastUpdate) / 1000
        );

        if (elapsed > 0) {
          const oldTotal = Number(
            localStorage.getItem("totalFocusSeconds") || 0
          );

          localStorage.setItem(
            "totalFocusSeconds",
            String(oldTotal + elapsed)
          );

          localStorage.setItem(
            "focusLastUpdate",
            String(now)
          );
        }
      } else {
        localStorage.setItem(
          "focusLastUpdate",
          String(now)
        );
      }

      if (remaining <= 0) {
        setIsRunning(false);

        localStorage.removeItem("focusEndTime");
        localStorage.removeItem("focusLastUpdate");
        localStorage.setItem("focusSeconds", "0");
      }
    };

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // ==========================================
  // START / PAUSE
  // ==========================================

  const handleStartPause = () => {
    if (isRunning) {
      // PAUSE
      setIsRunning(false);

      localStorage.removeItem("focusEndTime");
      localStorage.removeItem("focusLastUpdate");

      localStorage.setItem(
        "focusSeconds",
        String(seconds)
      );
    } else {
      // START

      let startSeconds = seconds;

      if (startSeconds <= 0) {
        startSeconds = FOCUS_TIME;
        setSeconds(FOCUS_TIME);
      }

      const endTime =
        Date.now() + startSeconds * 1000;

      localStorage.setItem(
        "focusEndTime",
        String(endTime)
      );

      localStorage.setItem(
        "focusSeconds",
        String(startSeconds)
      );

      localStorage.setItem(
        "focusLastUpdate",
        String(Date.now())
      );

      setIsRunning(true);
    }
  };

  // ==========================================
  // RESET
  // ==========================================

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(FOCUS_TIME);

    localStorage.removeItem("focusEndTime");
    localStorage.removeItem("focusLastUpdate");

    localStorage.setItem(
      "focusSeconds",
      String(FOCUS_TIME)
    );

    // IMPORTANT:
    // totalFocusSeconds delete பண்ணவில்லை.
    // Analytics history இருக்கும்.
  };

  // ==========================================
  // DISPLAY
  // ==========================================

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formatTime = (value) =>
    String(value).padStart(2, "0");

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
        {formatTime(minutes)}:
        {formatTime(remainingSeconds)}
      </div>

      <p className="timer-status">
        {isRunning
          ? "Focus session in progress..."
          : "Ready to focus?"}
      </p>

      <div className="timer-actions">

        <button
          className="timer-start-btn"
          onClick={handleStartPause}
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