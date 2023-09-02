import "./Auth.css";

import { Link } from "react-router-dom";

// components
import Message from "../../components/Message";

// hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// redux
import { register, reset } from "../../slices/authSlice";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();

    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = {
            name,
            email,
            password,
            confirmPassword,
        };

        dispatch(register(user));
    };

    // clean all auth states
    useEffect(() => {
        dispatch(reset());
    }, [dispatch]);

    return (
        <div id="register">
            <h2>ReactGram</h2>
            <p className="subtitle">
                Create an account to view your friends&apos; photos.
            </p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    value={name || ""}
                />
                <input
                    type="text"
                    name="e-mail"
                    placeholder="E-mail"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    value={email || ""}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    value={password || ""}
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }}
                    value={confirmPassword || ""}
                />
                {!loading && (
                    <input type="submit" name="register" value="Register" />
                )}

                {loading && (
                    <input
                        type="submit"
                        name="register"
                        value="Wait..."
                        disabled
                    />
                )}
                {error && <Message msg={error} type="error" />}
            </form>
            <p>
                Already have an account? <Link to="/login">Click here</Link>
            </p>
        </div>
    );
}

export default Register;
