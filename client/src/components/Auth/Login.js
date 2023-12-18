import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import { useUser } from "../../context/userContext";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Spinner from "../Layout/Spinner";
import Navbar from "../Layout/Navbar";

const Login = () => {
    const { login, isAuth } = useUser();
    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() => {
        const checkAuthenticationStatus = async () => {
            await new Promise((resolve) => setTimeout(resolve, 200));
            setIsLoading(false);
        };

        checkAuthenticationStatus();
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    if (isAuth) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <Navbar />
            <div className="container lgn-container">
                <div className="box lgn-box">
                    <h2 className="lgn-heading">Login to Your Account</h2>
                    <form
                        className="lgn-form"
                        action=""
                        onSubmit={handleSubmit}
                    >
                        <label htmlFor="username" className="lgn-label"></label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username *"
                            value={values.username}
                            onChange={handleChange}
                            required
                            className="lgn-input"
                        />

                        <label htmlFor="password" className="lgn-label"></label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password *"
                            value={values.password}
                            onChange={handleChange}
                            required
                            className="lgn-input"
                        />

                        <button type="submit" className="lgn-btn">
                            Login
                        </button>
                    </form>
                    <p className="link lgn-link">
                        Don't have an account?{" "}
                        <a href="/register" className="lgn-link">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
