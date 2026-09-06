import React, { useState } from "react";
import API from "../services/api";

function Signup({ onGoLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/signup", {
        name,
        email,
        password,
      });

      setMessage("Account created successfully");

      setTimeout(() => {
        onGoLogin();
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
  <div className="signup-container">
    <div className="signup-box">

      <h2>Create Account</h2>

      <p className="signup-subtitle">
        Create your productivity account
      </p>

      <form
        className="signup-form"
        onSubmit={handleSignup}
      >
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Minimum 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength="6"
          required
        />

        <button
          className="signup-button"
          type="submit"
        >
          Create Account
        </button>

        {message && (
          <p className="signup-message">
            {message}
          </p>
        )}
      </form>

      <p className="signup-login">
        Already have an account?{" "}
        <button
          type="button"
          className="login-link-button"
          onClick={onGoLogin}
        >
          Login
        </button>
      </p>

    </div>
  </div>
);
}

export default Signup;