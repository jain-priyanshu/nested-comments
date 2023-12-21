import { React, useEffect } from "react";
import { useUser } from "../../context/userContext";
import Navbar from "../Layout/Navbar";
import Spinner from "../Layout/Spinner";
import BlogsList from "../Blog/BlogsList";

const Home = () => {
    const { blogs, getBlogs } = useUser();

    useEffect(() => {
        getBlogs();
    }, []);

    if (!blogs) {
        return <Spinner />;
    }

    console.log("HOME");

    return (
        <div>
            <Navbar />
            <br></br>
            <BlogsList blogs={blogs} />
        </div>
    );
};

export default Home;
