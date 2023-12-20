import React, { useState } from "react";
import "./test.css";

const CommentForm = ({
    loading,
    error,
    onSubmit,
    autoFocus = false,
    initialValue = "",
}) => {
    const [message, setMessage] = useState(initialValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(message).then(() => setMessage(""));
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
