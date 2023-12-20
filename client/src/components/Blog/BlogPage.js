// BlogPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Layout/Navbar";
import Spinner from "../Layout/Spinner";
import CommentForm from "../Comment/CommentForm";
import CommentList from "../Comment/CommentList";
import { useUser } from "../../context/userContext";
import "./Blog.css";

const BlogPage = () => {
    const { id } = useParams();
    const { getBlogById, currBlog, getComments, parentComments, comments } =
        useUser();

    useEffect(() => {
        getBlogById(id);
        getComments(id);
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
            <section>
                <CommentForm />
                <br />
                {parentComments != null && parentComments.length > 0 && (
                    <div className="comment-list">
                        <CommentList comments={parentComments} />
                    </div>
                )}
            </section>
            <br />
        </div>
    );
};

export default BlogPage;
