import React, { useState } from "react";
import "./LoginPage.css"; // Import the CSS file for styling

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const attemptLogin = () => {
    // Use the email and password from state
    console.log("Attempting login with:", email, password);
    // Add your login logic here
  };

  return (
    <div className="login-container">
      <div className="login-panel">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="sign-in-button" onClick={attemptLogin}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
