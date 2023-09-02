import "./Auth.css";

import { Link } from "react-router-dom";

// components
import Message from "../../components/Message";

// hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// redux
import { login, reset } from "../../slices/authSlice";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = {
            email,
            password,
        };

        dispatch(login(user));
    };

    // clean all auth states
    useEffect(() => {
        dispatch(reset());
    }, [dispatch]);

    return (
        <div id="login">
            <h2>ReactGram</h2>
            <p className="subtitle">Login to see what&apos;s new.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="e-mail"
                    placeholder="E-mail"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email || ""}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password || ""}
                />
                {!loading && <input type="submit" name="login" value="Login" />}

                {loading && (
                    <input
                        type="submit"
                        name="login"
                        value="Wait..."
                        disabled
                    />
                )}
                {error && <Message msg={error} type="error" />}
            </form>

            <p>
                Don&apos;t have an account?{" "}
                <Link to="/register">Click here</Link>
            </p>
        </div>
    );
}

export default Login;
