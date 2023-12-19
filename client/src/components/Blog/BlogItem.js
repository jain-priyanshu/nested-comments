import React from "react";
import { Link } from "react-router-dom";
import "./Blog.css";

const BlogItem = ({ blog }) => {
    const { blog_id, title, body } = blog;

    return (
        <div className="blog-item">
            <h2 className="blog-title">{title}</h2>
            <p className="blog-preview">{body}</p>
            <Link to={`/blogs/${blog_id}`} className="read-more-link">
                Read More | Comments
            </Link>
        </div>
    );
};

export default BlogItem;
