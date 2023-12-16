import React from "react";
import "./Auth.css";

export default function Register() {
  return (
    <div className="container">
      <div className="box">
        <h2>Create an Account</h2>
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

          <button type="submit">Register</button>
        </form>
        <p className="link">
          Already have an account? <a href="/Login">Login</a>
        </p>
      </div>
    </div>
  );
}
