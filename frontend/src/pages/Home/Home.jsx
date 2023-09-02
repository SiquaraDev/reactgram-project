import "./Home.css";

import { Link } from "react-router-dom";

// components
import PhotoContainer from "../../components/PhotoContainer";

// hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// redux
import { getPhotos } from "../../slices/photoSlice";

function Home() {
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { photos, loading } = useSelector((state) => state.photo);

    // load all photos
    useEffect(() => {
        dispatch(getPhotos());
    }, [dispatch]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div id="home">
            {photos &&
                photos.map((photo) => (
                    <PhotoContainer photo={photo} key={photo._id} />
                ))}
            {photos && photos.length === 0 && (
                <h2 className="no-photos">
                    There are no photos published yet.{" "}
                    <Link to={`/users/${user._id}`}>Click here.</Link>
                </h2>
            )}
        </div>
    );
}

export default Home;
