import Comment from "./Comment";

const CommentList = ({ comments }) => {
    return comments.map((comment) => (
        <div key={comment.comment_id} className="comment-stack">
            <Comment {...comment} />
        </div>
    ));
};

export default CommentList;