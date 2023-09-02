import "./Photo.css";

// components
import Message from "../../components/Message";
import PhotoItem from "../../components/PhotoItem";
import LikeContainer from "../../components/LikeContainer";
import CommentItem from "../../components/CommentItem";

// hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

// redux
import { getPhoto, like, comment } from "../../slices/photoSlice";

function Photo() {
    const { id } = useParams();

    const dispatch = useDispatch();

    const resetMessage = useResetComponentMessage(dispatch);

    const { user } = useSelector((state) => state.auth);
    const { photo, loading, error, message } = useSelector(
        (state) => state.photo
    );

    const [commentText, setCommentText] = useState("");

    // load photo data
    useEffect(() => {
        dispatch(getPhoto(id));
    }, [dispatch, id]);

    // insert a like
    const handleLike = () => {
        dispatch(like(photo._id));

        resetMessage();
    };

    // insert a comment
    const handleComment = (e) => {
        e.preventDefault();

        const commentData = {
            comment: commentText,
            id: photo._id,
        };

        dispatch(comment(commentData));

        setCommentText("");

        resetMessage();
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div id="photo">
            <PhotoItem photo={photo} />
            <LikeContainer photo={photo} user={user} handleLike={handleLike} />
            <div className="message-container">
                {error && <Message msg={error} type="error" />}
                {message && <Message msg={message} type="success" />}
            </div>
            <div className="comments">
                {photo.comments && (
                    <>
                        <h3>Comments: ({photo.comments.length})</h3>
                        <form onSubmit={handleComment}>
                            <input
                                type="text"
                                name="comment"
                                placeholder="Comment"
                                onChange={(e) => setCommentText(e.target.value)}
                                value={commentText || ""}
                            />
                            <input type="submit" value="Comment" />
                        </form>
                        {photo.comments.length === 0 && (
                            <p>There are no comments yet.</p>
                        )}
                        {photo.comments.map((comment) => (
                            <CommentItem
                                comment={comment}
                                key={comment.comment}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
export default Photo;
