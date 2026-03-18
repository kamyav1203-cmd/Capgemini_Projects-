Question
11
Button Hover Event using Arrow Function
Description
Task 3
Button Hover Event using Arrow Function
Description
Mouse Hover Event

Scenario
When the user moves the mouse over the Submit button, a message should appear.

Requirement
Use mouseover

Use Arrow Function

HTML
<button id="submitBtn">Submit</button>
JavaScript
document.getElementById("submitBtn").addEventListener("mouseover", () => {

console.log("Mouse hovered over submit button");

});