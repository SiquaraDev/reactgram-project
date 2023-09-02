import "./CommentItem.css";

import { uploads } from "../utils/config";

import { Link } from "react-router-dom";

function CommentItem({ comment }) {
    return (
        <div className="comment">
            <div className="author">
                {comment.userImage && (
                    <img
                        src={`${uploads}/users/${comment.userImage}`}
                        alt={comment.userName}
                    />
                )}
                <Link to={`/users/${comment.userId}`}>
                    <p>{comment.userName}</p>
                </Link>
            </div>
            <p>{comment.comment}</p>
        </div>
    );
}
export default CommentItem;
