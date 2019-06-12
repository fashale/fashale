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


