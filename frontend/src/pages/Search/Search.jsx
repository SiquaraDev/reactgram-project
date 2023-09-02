import "./Search.css";

import { Link } from "react-router-dom";

// components
import PhotoContainer from "../../components/PhotoContainer";

// hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "../../hooks/useQuery";

// redux
import { searchPhotos } from "../../slices/photoSlice";

function Search() {
    const query = useQuery();
    const search = query.get("q");

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { photos, loading } = useSelector((state) => state.photo);

    // load all photos
    useEffect(() => {
        dispatch(searchPhotos(search));
    }, [dispatch, search]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div id="search">
            <h2>You are searching for: {search}</h2>
            {photos &&
                photos.map((photo) => (
                    <PhotoContainer photo={photo} key={photo._id} />
                ))}
            {photos && photos.length === 0 && (
                <h2 className="no-photos">
                    Could not find the photos.{" "}
                    <Link to={`/users/${user._id}`}>Click here.</Link>
                </h2>
            )}
        </div>
    );
}
export default Search;
