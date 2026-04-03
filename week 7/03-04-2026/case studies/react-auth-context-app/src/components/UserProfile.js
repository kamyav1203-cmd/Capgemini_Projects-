import React from "react";
import { useNavigate } from "react-router-dom";

function UserProfile() {
    const navigate = useNavigate();

    const username = localStorage.getItem("username");

    const logout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        navigate("/");
    };

    return (
        <div>
            <h2>User Profile</h2>
            <p>Username: {username}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default UserProfile;