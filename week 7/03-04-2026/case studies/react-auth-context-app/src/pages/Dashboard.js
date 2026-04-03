import React from "react";
import UserProfile from "../components/UserProfile";

function Dashboard() {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Dashboard</h1>

            <UserProfile />

            <h3>Dashboard Content</h3>
            <p>Now everything should be visible after login.</p>
        </div>
    );
}

export default Dashboard;