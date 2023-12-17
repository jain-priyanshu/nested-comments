import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import setAuthToken from "../../utils/setToken";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuth, setAuth] = useState(false);
    const token = localStorage.getItem("token");

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
        } catch (err) {
            console.log(err);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setAuth(false);
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
        logout,
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
