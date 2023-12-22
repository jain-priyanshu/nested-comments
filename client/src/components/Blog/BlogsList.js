import React from "react";
import BlogItem from "./BlogItem";
import "./Blog.css";

const BlogsList = ({ blogs }) => {
    return (
        <div className="blogs-container">
            {blogs.map((blog) => (
                <BlogItem key={blog.blog_id} blog={blog} />
            ))}
        </div>
    );
};

export default BlogsList;
