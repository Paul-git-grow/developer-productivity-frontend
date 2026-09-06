import React, { useState } from "react";
import API from "../services/api";
import "../styles/login.css";

function Login({ onLoginSuccess, onGoSignup })  {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

    const response = await API.post("/auth/login", {
  email,
  password,
});

localStorage.setItem(
  "token",
  response.data.token
);

localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

setMessage("Login Successful!");

onLoginSuccess();

      console.log("Login Response:", response.data);
    }  catch (error) {
  console.log("LOGIN ERROR:", error);
  console.log("BACKEND RESPONSE:", error.response?.data);

  setMessage(
    error.response?.data?.message ||
    error.message ||
    "Login failed"
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Welcome Back</h1>
        <p>Login to your Productivity Dashboard</p>

        <label>Email</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {message && (
          <p className="login-message">{message}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>


        <button
  type="button"
  onClick={onGoSignup}
>
  Create New Account
</button>
      </form>
    </div>
  );
}

export default Login;