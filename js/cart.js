$(".cartNumber").on("click", function() {
    var num = $(this).val();
    var $price = $(".currentprice");
    var price = $price.text();
    $(".totalPrice").text((num * price).toFixed(3));
});