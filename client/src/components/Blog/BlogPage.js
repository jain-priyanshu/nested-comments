// BlogPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import Spinner from "../Layout/Spinner";
import { useUser } from "../../context/userContext";
import "./Blog.css";

const BlogPage = () => {
    const { id } = useParams();
    const { getBlogById, currBlog } = useUser();

    useEffect(() => {
        getBlogById(id);
    }, []);

    if (!currBlog) {
        return <Spinner />;
    }

    return (
        <div>
            <Navbar />

            <div className="blog-page-container">
                <div className="blog-page-box">
                    <h1 className="blog-page-title">{currBlog.title}</h1>
                    <hr className="blog-page-divider" />
                    <div className="blog-page-body">{currBlog.body}</div>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
