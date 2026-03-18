Question
12
Button Click Event using Arrow Function
Description
Task 1
Button Click Event using Arrow Function
Description
Button Click Event using Arrow Function

Scenario
When the user clicks the Login button, a message should appear indicating that the login process has started.

Requirement
Use addEventListener

Use Arrow Function

Display a message in console and alert

HTML
<button id="loginBtn">Login</button>
JavaScript
document.getElementById("loginBtn").addEventListener("click", (e) => {

console.log("Login button clicked");

alert("Login process started");

});
