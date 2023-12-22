import { useEffect, useState } from "react";
import { IconBtn } from "./IconBtn";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { FaEdit, FaHeart, FaRegHeart, FaReply, FaTrash } from "react-icons/fa";
import { useUser } from "../../context/userContext";
import "./test.css";

const Comment = ({
    comment_id,
    body,
    username,
    created_at,
    likes,
    likedByMe,
    blog_id,
    user_id, // user who posted this comment
}) => {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { getReplies, postComment, userId } = useUser();
    const [hideReplies, setHideReplies] = useState(false);
    const replies = getReplies(comment_id);

    const dateFormatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });

    // calculates how long ago was the comment created, in minutes.
    const timeDiff = (Date.now() - new Date(created_at)) / (1000 * 60);

    return (
        <div className="test">
            <div className="comment">
                <div className="header">
                    <span className="name">{username}</span>
                    <span className="date">
                        {dateFormatter.format(Date.parse(created_at))}
                    </span>
                </div>
                {isEditing ? (
                    <CommentForm autoFocus={true} initialValue={body} />
                ) : (
                    <div className="message">{body}</div>
                )}
                <div className="footer">
                    <IconBtn
                        Icon={likedByMe ? FaHeart : FaRegHeart}
                        aria-label={likedByMe ? "Unlike" : "Like"}
                    >
                        {likes}
                    </IconBtn>
                    <IconBtn
                        onClick={() => setIsReplying((prev) => !prev)}
                        isActive={isReplying}
                        Icon={FaReply}
                        aria-label={isReplying ? "Cancel Reply" : "Reply"}
                    />
                    {/*  can only edit is the logged in user is the comment creater, 
                    and comment was posted at most 5 minutes ago. */}
                    {userId && user_id === userId && timeDiff <= 5.0 && (
                        <>
                            <IconBtn
                                onClick={() => setIsEditing((prev) => !prev)}
                                isActive={isEditing}
                                Icon={FaEdit}
                                aria-label={isEditing ? "Cancel Edit" : "Edit"}
                            />
                            <IconBtn
                                Icon={FaTrash}
                                aria-label="Delete"
                                color="danger"
                            />
                        </>
                    )}
                </div>
                {isReplying && (
                    <div className="mt-1 ml-3">
                        <CommentForm
                            autoFocus={true}
                            onSubmit={postComment}
                            blog_id={blog_id}
                            parent_id={comment_id}
                        />
                    </div>
                )}
                {replies && replies.length > 0 && (
                    <>
                        <div
                            className={`nested-comments-stack ${
                                hideReplies ? "hide" : ""
                            }`}
                        >
                            <button
                                className="collapse-line"
                                aria-label="Hide Replies"
                                onClick={() => setHideReplies(true)}
                            />
                            <div className="nested-comments">
                                <CommentList comment_list={replies} />
                            </div>
                        </div>
                        <button
                            className={`btn mt-1 ${!hideReplies ? "hide" : ""}`}
                            onClick={() => setHideReplies(false)}
                        >
                            Show Replies
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Comment;
