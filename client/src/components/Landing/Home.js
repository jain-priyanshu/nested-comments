import React from "react";
import { useUser } from "../../context/user/userContext";
import Navbar from "../Layout/Navbar";

const Home = () => {
    const { isAuth, logout } = useUser();

    return (
        <div>
            <Navbar />
            <br></br>
            Comments Coming Soon......?
        </div>
    );
};

export default Home;
