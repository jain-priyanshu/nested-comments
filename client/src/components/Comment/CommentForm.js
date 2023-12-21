import React, { useState, useEffect, Children } from "react";
import { useUser } from "../../context/userContext";
import "./test.css";

const CommentForm = ({
    loading,
    onSubmit,
    autoFocus = false,
    initialValue = "",
    blog_id,
    parent_id = "",
    user_id,
}) => {
    const [message, setMessage] = useState(initialValue);
    const { error } = useUser();

    const handleSubmit = (e) => {
        e.preventDefault();
        const values = {
            body: message,
            blog_id: blog_id,
            user_id: user_id,
            parent_id: parent_id,
        };
        onSubmit(values).then(() => setMessage(""));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="comment-form-row">
                <textarea
                    autoFocus={autoFocus}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your comment..."
                    className="message-input"
                />
                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Loading" : "Post"}
                </button>
            </div>
            <div className="error-msg">{error}</div>
        </form>
    );
};

export default CommentForm;
