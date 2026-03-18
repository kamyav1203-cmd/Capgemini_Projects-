Question
8
Track Button Click Analytics
Description
Track Button Click Analytics
Scenario:
A company wants to track which buttons users click the most.

<button onclick="trackClick('Buy Now')">Buy Now</button>
<button onclick="trackClick('Add Wishlist')">Add Wishlist</button>

<script>

function trackClick(action){

logger.log("INFO","User Action:",action);

}

</script>