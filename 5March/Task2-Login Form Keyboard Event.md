Question
2
Login Form Keyboard Event
Description
Login Form Keyboard Event
Scenario:
When the user presses Enter, the login form should submit.

Requirement

Use keydown

<input type="text" id="username" placeholder="Enter username">

<script>

document.getElementById("username").addEventListener("keydown", function(e){

if(e.key === "Enter"){

console.log("Login attempt triggered");

alert("Submitting login form");

}

});

</script>