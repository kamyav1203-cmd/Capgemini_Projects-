Question
7
Log Form Validation Errors
Description
Log Form Validation Errors
Scenario:
If a user submits an invalid form, developers log the issue.

function validateForm(){

const email = document.getElementById("email").value;

if(!email.includes("@")){

logger.log("WARN","Invalid Email Entered",email);

alert("Invalid email");

}

}