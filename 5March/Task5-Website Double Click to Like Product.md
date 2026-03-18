Question
5
Website Double Click to Like Product
Description
Scenario:
In many apps (Instagram, shopping apps), double-clicking a product image likes the product.

Requirement

Use dblclick

Increase like counter

<img id="product" src="https://via.placeholder.com/200">
<p>Likes: <span id="count">0</span></p>

<script>
let likes = 0;

document.getElementById("product").addEventListener("dblclick", function(){

    likes++;

    document.getElementById("count").innerText = likes;

    console.log("Product liked", likes);

});
</script>