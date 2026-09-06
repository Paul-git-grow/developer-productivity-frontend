import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =========================
  // GET LOGGED-IN USER PROFILE
  // =========================

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await API.get("/auth/profile");

      console.log("PROFILE DATA:", response.data);

      const profileUser =
        response.data.user || response.data;

      setUser({
        name: profileUser.name || "",
        email: profileUser.email || "",
        role: profileUser.role || "Developer",
      });
    } catch (error) {
      console.log(
        "Profile Fetch Error:",
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-heading">
        <h1>My Profile</h1>
        <p>Your account information</p>
      </div>

      <div className="profile-card">

        {/* Avatar */}

        <div className="profile-avatar">
          {user.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}
        </div>

        {/* User Information */}

        <div className="profile-info">

          <div className="profile-field">
            <span>Full Name</span>
            <h3>
              {user.name || "No name"}
            </h3>
          </div>

          <div className="profile-field">
            <span>Email Address</span>
            <h3>
              {user.email || "No email"}
            </h3>
          </div>

          <div className="profile-field">
            <span>Role</span>
            <h3>
              {user.role || "Developer"}
            </h3>
          </div>

        </div>

        {message && (
          <p className="profile-message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default Profile;