Question
14
Search Input Keyboard Event using Arrow Function
Description
Task 2
Search Input Keyboard Event using Arrow Function
Description
Search Input Keyboard Event

Scenario
When the user presses Enter inside the search box, a search should be triggered.

Requirement
Use keydown

Use Arrow Function

Detect Enter key

HTML
<input type="text" id="searchBox" placeholder="Search product">
JavaScript
document.getElementById("searchBox").addEventListener("keydown", (e) => {

if(e.key === "Enter"){

console.log("Search triggered");

alert("Searching product...");

}

});