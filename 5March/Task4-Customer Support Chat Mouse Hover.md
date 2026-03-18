Question
4
Customer Support Chat Mouse Hover
Description
Customer Support Chat Mouse Hover
Scenario:
A chat icon shows tooltip when mouse hovers over it.

Requirement

Use mouseover

Display message

<div id="chatIcon">💬 Chat Support</div>
<p id="info"></p>

<script>

document.getElementById("chatIcon").addEventListener("mouseover", function(){

    document.getElementById("info").innerText =
    "Click here to talk with customer support";

    console.log("Mouse hovered over chat icon");

});

</script>