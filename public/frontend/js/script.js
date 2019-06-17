// navbar
// show search-bar

function showSearchBar() {
    var searchbar = document.getElementById("search-bar");
    var toggle = document.getElementsByClassName("search-toggle")[0];

    if (searchbar.style.visibility === "hidden" || searchbar.style.visibility == "") {
        searchbar.style.visibility = "visible";
        toggle.innerHTML = '<i class="fa fa-times"></i>';
    } else {
        searchbar.style.visibility = "hidden";
        toggle.innerHTML = '<i class="fa fa-search"></i>';
    }
}


$('select[name="sort_in_brand"]').change(function(){
    var path = window.location.pathname.split('/');
    var linkRedirect = '/' + path[1] + '/' + path[2] + '/' + $(this).val();        
    window.location.pathname = linkRedirect;
});

$('select[name="sort_in_category"]').change(function(){
    var path = window.location.pathname.split('/');
    var linkRedirect = '/' + path[1] + '/' + path[2] + '/' + path[3] + '/' + $(this).val();        
    window.location.pathname = linkRedirect;
});

$('select[name="sort_in_search"]').change(function(){
    var path = window.location.pathname.split('/');
    var linkRedirect = '/' + path[1] + '/' + $(this).val();        
    window.location.pathname = linkRedirect;
});


$(":input[type='number']").change(function() {
    let index = parseInt($(this).attr('id'));
    let list_number = $(':input[name="list_number"]').val().split(',');
    list_number[index] = $(this).val();
    $(':input[name="list_number"]').val(list_number.toString());

    let old = parseInt($(this).parent().next().text());
    $(this).parent().next().text($(this).val() * parseInt($(this).parent().prev().text()) + ' đ');
    $('#total_buy').text(parseInt($('#total_buy').text()) + parseInt($(this).parent().next().text()) - old);
    $('#total_payment').text(parseInt($('#total_buy').text()) + parseInt($('#delivery_charge').text()));

    $(':input[name="total_buy"]').val($('#total_buy').text());
    $(':input[name="delivery_charge"]').val($('#delivery_charge').text());
    $(':input[name="total_payment"]').val($('#total_payment').text());

    $(this).parent().next().next().children('button').prop('disabled', false);
});

$("#confirm").click(function(e) {
    e.preventDefault();
    let prefixFrontend = '';
    $('#form_confirm').attr('action', prefixFrontend + '/bills/save').submit();
});



