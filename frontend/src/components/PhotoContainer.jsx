import "./PhotoContainer.css";

import { Link } from "react-router-dom";

// components
import LikeContainer from "./LikeContainer";
import PhotoItem from "./PhotoItem";

//hooks
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../hooks/useResetComponentMessage";

// redux
import { like } from "../slices/photoSlice";

function PhotoContainer({ photo }) {
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    const resetMessage = useResetComponentMessage(dispatch);

    // like a photo
    const handleLike = (photo) => {
        dispatch(like(photo._id));

        resetMessage();
    };
    return (
        <div key={photo._id}>
            <PhotoItem photo={photo} />
            <LikeContainer photo={photo} user={user} handleLike={handleLike} />
            <Link className="btn" to={`/photos/${photo._id}`}>
                See more.
            </Link>
        </div>
    );
}
export default PhotoContainer;
