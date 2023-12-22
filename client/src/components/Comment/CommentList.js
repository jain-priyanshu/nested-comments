import { useEffect } from "react";
import Comment from "./Comment";
import { useUser } from "../../context/userContext";
import "./test.css";

const CommentList = ({ comment_list }) => {
    return comment_list.map((comment) => (
        <div key={comment.comment_id} className="comment-stack">
            <Comment {...comment} />
        </div>
    ));
};

export default CommentList;
