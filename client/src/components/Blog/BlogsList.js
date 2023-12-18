import React from "react";
import BlogItem from "./BlogItem";
import "./BlogItem.css";

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
