import "./EditProfile.css";

import { uploads } from "../../utils/config";

// hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

// redux
import { profile, updateProfile } from "../../slices/userSlice";

// components
import Message from "../../components/Message";

function EditProfile() {
    const dispatch = useDispatch();

    const resetMessage = useResetComponentMessage(dispatch);

    const { user, message, error, loading } = useSelector(
        (state) => state.user
    );

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [bio, setBio] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    // load user data
    useEffect(() => {
        dispatch(profile());
    }, [dispatch]);

    // fill form with user data
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setBio(user.bio);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            name,
        };

        if (profileImage) {
            userData.profileImage = profileImage;
        }

        if (bio) {
            userData.bio = bio;
        }

        if (password) {
            userData.password = password;
        }

        // build form data
        const formData = new FormData();

        const userFormData = Object.keys(userData).forEach((key) =>
            formData.append(key, userData[key])
        );

        formData.append("user", userFormData);

        await dispatch(updateProfile(formData));

        resetMessage();
    };

    const handleFile = (e) => {
        // image preview
        const image = e.target.files[0];

        setPreviewImage(image);

        // update image state
        setProfileImage(image);
    };

    return (
        <div id="edit-profile">
            <h2>Edit your data.</h2>
            <p className="subtitle">
                Add an profile image and tell more about yourself...
            </p>
            {(user.profileImage || previewImage) && (
                <img
                    className="profile-image"
                    src={
                        previewImage
                            ? URL.createObjectURL(previewImage)
                            : `${uploads}/users/${user.profileImage}`
                    }
                    alt={user.name}
                />
            )}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    autoComplete="username"
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name || ""}
                />
                <input
                    type="email"
                    name="e-mail"
                    placeholder="E-mail"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email || ""}
                    disabled
                />
                <label>
                    <span>Profile image:</span>
                    <input type="file" name="image" onChange={handleFile} />
                </label>
                <label>
                    <span>Bio:</span>
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        onChange={(e) => setBio(e.target.value)}
                        value={bio || ""}
                    />
                </label>
                <label>
                    <span>Do you want to change your password?</span>
                    <input
                        type="password"
                        name="password"
                        placeholder="New password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password || ""}
                    />
                </label>
                {!loading && (
                    <input type="submit" name="update" value="Update" />
                )}
                {loading && (
                    <input
                        type="submit"
                        name="update"
                        value="Wait..."
                        disabled
                    />
                )}
                {error && <Message msg={error} type="error" />}
                {message && <Message msg={message} type="success" />}
            </form>
        </div>
    );
}
export default EditProfile;
