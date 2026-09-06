import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/settings-page.css";

function Settings() {
  /* =========================
     PROFILE
  ========================= */

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     NOTIFICATIONS
  ========================= */

  const [notifications, setNotifications] = useState({
    taskReminder: true,
    dailySummary: true,
    weeklyReport: false,
  });

  /* =========================
     APPEARANCE
  ========================= */

  const [appearance, setAppearance] = useState(
    localStorage.getItem("theme") || "Light"
  );

  /* =========================
     PRODUCTIVITY
  ========================= */

  const [focusLength, setFocusLength] = useState("25 minutes");
  const [weekStart, setWeekStart] = useState("Monday");

  /* =========================
     GET LOGGED-IN USER PROFILE
  ========================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        setError("");

        const response = await API.get("/auth/profile");

        console.log("SETTINGS PROFILE:", response.data);

        const user = response.data.user || response.data;

        setProfile({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "Developer",
        });
      } catch (error) {
        console.log(
          "Settings Profile Error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            "Unable to load profile"
        );
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* =========================
     PROFILE CHANGE
  ========================= */

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));

    setSaved(false);
    setError("");
  };

  /* =========================
     NOTIFICATION TOGGLE
  ========================= */

  const toggleNotification = (name) => {
    setNotifications((previousNotifications) => ({
      ...previousNotifications,
      [name]: !previousNotifications[name],
    }));

    setSaved(false);
  };

  /* =========================
     THEME CHANGE
  ========================= */

 const handleThemeChange = (theme) => {
  setAppearance(theme);
  localStorage.setItem("theme", theme);

  if (theme === "Dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (theme === "Light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    document.documentElement.setAttribute(
      "data-theme",
      prefersDark ? "dark" : "light"
    );
  }

  setSaved(false);
};
  /* =========================
     SAVE PROFILE
  ========================= */

  const handleSave = async () => {
    if (!profile.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!profile.email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response = await API.put(
        "/auth/profile",
        {
          name: profile.name,
          email: profile.email,
          role: profile.role,
        }
      );

      const updatedUser =
        response.data.user || response.data;

      /* Update Settings state */

      setProfile({
        name: updatedUser.name || profile.name,
        email: updatedUser.email || profile.email,
        role:
          updatedUser.role ||
          profile.role ||
          "Developer",
      });

      /* Update browser localStorage */

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      /* Save other settings locally */

      localStorage.setItem(
        "notifications",
        JSON.stringify(notifications)
      );

      localStorage.setItem(
        "focusLength",
        focusLength
      );

      localStorage.setItem(
        "weekStart",
        weekStart
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.log(
        "Profile Update Error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };

  /* =========================
     LOADING
  ========================= */

  if (profileLoading) {
    return (
      <div className="settings-page">
        <h2>Loading settings...</h2>
      </div>
    );
  }

  return (
    <div className="settings-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="settings-header">
        <div>
          <h2>Settings</h2>

          <p>
            Manage your profile and productivity preferences.
          </p>
        </div>

        <button
          className="save-settings-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {saved && (
        <div className="settings-success">
          ✓ Settings saved successfully
        </div>
      )}

      {/* =========================
          ERROR MESSAGE
      ========================= */}

      {error && (
        <div className="settings-error">
          {error}
        </div>
      )}

      {/* =========================
          PROFILE
      ========================= */}

      <div className="settings-card">

        <div className="settings-card-header">
          <div>
            <h3>Profile</h3>

            <p>
              Update your personal information.
            </p>
          </div>
        </div>

        <div className="profile-section">

          {/* Dynamic Avatar */}

          <div className="profile-avatar">
            {profile.name
              ? profile.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="profile-fields">

            {/* NAME */}

            <div className="settings-field">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Enter your name"
              />
            </div>

            {/* EMAIL */}

            <div className="settings-field">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                placeholder="Enter your email"
              />
            </div>

            {/* ROLE */}

            <div className="settings-field">
              <label>Role</label>

              <input
                type="text"
                name="role"
                value={profile.role}
                onChange={handleProfileChange}
                placeholder="Enter your role"
              />
            </div>

          </div>
        </div>
      </div>

      {/* =========================
          NOTIFICATIONS
      ========================= */}

      <div className="settings-card">

        <div className="settings-card-header">
          <div>
            <h3>Notifications</h3>

            <p>
              Choose which notifications you want to receive.
            </p>
          </div>
        </div>

        <div className="settings-options">

          {/* TASK REMINDER */}

          <div className="settings-option">
            <div>
              <strong>Task reminders</strong>

              <span>
                Get reminders for upcoming tasks.
              </span>
            </div>

            <button
              type="button"
              className={
                notifications.taskReminder
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                toggleNotification("taskReminder")
              }
            >
              <span></span>
            </button>
          </div>

          {/* DAILY SUMMARY */}

          <div className="settings-option">
            <div>
              <strong>Daily summary</strong>

              <span>
                Receive a summary of your daily productivity.
              </span>
            </div>

            <button
              type="button"
              className={
                notifications.dailySummary
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                toggleNotification("dailySummary")
              }
            >
              <span></span>
            </button>
          </div>

          {/* WEEKLY REPORT */}

          <div className="settings-option">
            <div>
              <strong>Weekly report</strong>

              <span>
                Receive your weekly productivity report.
              </span>
            </div>

            <button
              type="button"
              className={
                notifications.weeklyReport
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                toggleNotification("weeklyReport")
              }
            >
              <span></span>
            </button>
          </div>

        </div>
      </div>

      {/* =========================
          APPEARANCE
      ========================= */}

      <div className="settings-card">

        <div className="settings-card-header">
          <div>
            <h3>Appearance</h3>

            <p>
              Choose how your dashboard looks.
            </p>
          </div>
        </div>

        <div className="appearance-options">

          {["Light", "Dark", "System"].map(
            (theme) => (
              <button
                type="button"
                key={theme}
                className={
                  appearance === theme
                    ? "appearance-option selected"
                    : "appearance-option"
                }
                onClick={() =>
                  handleThemeChange(theme)
                }
              >

                <div
                  className={`theme-preview ${theme.toLowerCase()}`}
                >
                  <div></div>
                  <div></div>
                  <div></div>
                </div>

                <span>{theme}</span>

                {appearance === theme && (
                  <span className="theme-check">
                    ✓
                  </span>
                )}

              </button>
            )
          )}

        </div>
      </div>

      {/* =========================
          PRODUCTIVITY
      ========================= */}

      <div className="settings-card">

        <div className="settings-card-header">
          <div>
            <h3>Productivity Preferences</h3>

            <p>
              Customize your productivity experience.
            </p>
          </div>
        </div>

        <div className="productivity-preferences">

          {/* FOCUS SESSION */}

          <div className="preference-row">
            <div>
              <strong>
                Focus session length
              </strong>

              <span>
                Default duration for focus sessions.
              </span>
            </div>

            <select
              value={focusLength}
              onChange={(e) => {
                setFocusLength(e.target.value);
                setSaved(false);
              }}
            >
              <option>25 minutes</option>
              <option>45 minutes</option>
              <option>60 minutes</option>
              <option>90 minutes</option>
            </select>
          </div>

          {/* START WEEK */}

          <div className="preference-row">
            <div>
              <strong>
                Start of the week
              </strong>

              <span>
                Choose the first day of your week.
              </span>
            </div>

            <select
              value={weekStart}
              onChange={(e) => {
                setWeekStart(e.target.value);
                setSaved(false);
              }}
            >
              <option>Monday</option>
              <option>Sunday</option>
            </select>
          </div>

        </div>
      </div>

      {/* =========================
          ACCOUNT ACTIONS
      ========================= */}

      <div className="settings-card danger-card">

        <div>
          <h3>Account Actions</h3>

          <p>
            Logout from your current account.
          </p>
        </div>

        <button
          type="button"
          className="logout-settings-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Settings;