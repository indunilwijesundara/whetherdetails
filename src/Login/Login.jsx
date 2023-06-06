import React, { useState } from "react";
import "./Login.scss";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      // Simulate API call for authentication
      const response = await loginUser(username, password);

      // Handle successful authentication
      console.log("User logged in:", response);

      // Clear the input fields and error state
      setUsername("");
      setPassword("");
      setError("");

      // Redirect to the dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      // Handle authentication error
      setError("Invalid username or password");
    }
  };

  const loginUser = (username, password) => {
    // Simulated API call
    return new Promise((resolve, reject) => {
      // Simulate a delay to mimic server response
      setTimeout(() => {
        // Check if the username and password are valid
        if (username === "admin" && password === "password") {
          // Return a user object or any other necessary data
          resolve({ username });
        } else {
          reject(new Error("Invalid username or password"));
        }
      }, 1000); // Simulated delay of 1 second
    });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn-login">
          Login
        </button>{" "}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
