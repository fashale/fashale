$(".cartNumber").on("click", function() {
    var num = $(this).val();
    var $totalPrice = $(this).parent().parent().find(".totalPrice");
    var price = $(this).parent().parent().find(".currentprice").text();
    $totalPrice.text((num * price).toFixed(3));
});