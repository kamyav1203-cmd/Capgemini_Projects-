Question
6
Track User Login Activity
Description
Track User Login Activity
Scenario:
In a web application, developers want to log when a user logs in for monitoring purposes.

Requirement

Capture login button click

Send log to remote server

Include username in log

<input id="username" placeholder="Enter Username">
<button onclick="login()">Login</button>

<script>
function login(){

const user = document.getElementById("username").value;

logger.log("INFO", "User Login Attempt", {username:user});

}
</script>