import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { useUser } from "../../context/user/userContext";
import { useEffect, useState } from "react";

const Login = () => {
    const { login, isAuth } = useUser();

    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const { username, password } = user;

    const values = { username, password };

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(values);
    };

    if (isAuth) {
        console.log("Logged In");
    }

    return (
        <div className="container">
            <div className="box">
                <h2>Login to Your Account</h2>
                <form action="" onSubmit={handleSubmit}>
                    <label htmlFor="username"></label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username *"
                        value={values.username}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="password"></label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password *"
                        value={values.password}
                        onChange={handleChange}
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
};

export default Login;
