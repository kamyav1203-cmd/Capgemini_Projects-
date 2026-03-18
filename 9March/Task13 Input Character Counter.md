Question
13
Input Character Counter
Description
Task 4
Input Character Counter
Description
Live Character Counter

Scenario
When a user types inside a textarea, the system should display the number of characters typed.

Requirement
Use keyup

Use Arrow Function

Update character count dynamically

HTML
<textarea id="message"></textarea>

<p id="count">Characters: 0</p>
JavaScript
document.getElementById("message").addEventListener("keyup", (e) => {

let length = e.target.value.length;

document.getElementById("count").innerText = "Characters: " + length;

});