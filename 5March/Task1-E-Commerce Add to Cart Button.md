Question
1
JavaScript Events
Description
Task 1: E-Commerce Add to Cart Button
Scenario:
In an online shopping website, when a user clicks Add to Cart, the product should be added to the cart and a message displayed.

Requirement
Use click event

Display product name in console

Show message in UI

<button id="addCart">Add to Cart</button>
<p id="msg"></p>

<script>
document.getElementById("addCart").addEventListener("click", function(){

    console.log("Product added to cart");

    document.getElementById("msg").innerHTML =
    "Item successfully added to cart";

});
</script>