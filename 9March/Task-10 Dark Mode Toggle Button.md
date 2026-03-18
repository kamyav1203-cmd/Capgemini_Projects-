Question
10
Dark Mode Toggle Button
Description
Task 5
Dark Mode Toggle Button
Description
Dark Mode Toggle

Scenario
When the user clicks the Dark Mode button, the background color should change.

Requirement
Use Arrow Function

Modify CSS using JavaScript

HTML
<button id="darkMode">Toggle Dark Mode</button>
JavaScript
document.getElementById("darkMode").addEventListener("click", () => {

document.body.classList.toggle("dark");

});
CSS
.dark{
background:black;
color:white;
}