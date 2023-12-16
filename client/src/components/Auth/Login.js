import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  return (
    <div className="container">
      <div className="box">
        <h2>Login to Your Account</h2>
        <form action="#" method="post">
          <label htmlFor="username"></label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username *"
            required
          />

          <label htmlFor="password"></label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password *"
            required
          />

          <button type="submit">Login</button>
        </form>
        <p className="link">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}
