import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import setAuthToken from "../utils/setToken";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuth, setAuth] = useState(false);
    const token = localStorage.getItem("token");
    const [blogs, setBlogs] = useState(null);

    const loadUser = async () => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }

        try {
            const res = await axios.get("http://localhost/users/current");
            setAuth(true);
            // console.log(res.data);
        } catch (err) {
            // console.log(err);
        }
    };

    // login
    const login = async (formData) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const res = await axios.post(
                "http://localhost/users/login",
                formData,
                config
            );
            setAuth(true);
            localStorage.setItem("token", res.data.token);
            loadUser();
        } catch (err) {
            console.log(err);
        }
    };

    // register
    const register = async (formData) => {
        const config = {
            hedaers: {
                "Content-Type": "application/JSON",
            },
        };

        try {
            const res = await axios.post(
                "http://localhost/users/register",
                formData,
                config
            );
            setAuth(true);
            localStorage.setItem("token", res.data.token);
            loadUser();
        } catch (err) {
            console.log(err);
        }
    };

    // logout
    const logout = () => {
        localStorage.removeItem("token");
        setAuth(false);
    };

    const getBlogs = async () => {
        const config = {
            headers: {
                "Content-Type": "Application/JSON",
            },
        };
        try {
            const res = await axios.get("http://localhost/blogs/all", config);
            setBlogs(res.data);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        setAuthToken(token);
    }, [token]);

    if (!isAuth) {
        loadUser();
    }

    const contextValue = {
        user,
        isAuth,
        login,
        register,
        logout,
        blogs,
        getBlogs,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser nust be used within a UserProvider");
    }

    return context;
};
