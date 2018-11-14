var slideIndex = 1;
showDivs(slideIndex);

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("mySlides");
    if (n > x.length) {slideIndex = 1}
    if (n < 1) {slideIndex = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    x[slideIndex-1].style.display = "block";
}


function plusDivs(n) {
  showDivs(slideIndex += n);
}



$(function() {
    var dates = $( "#from, #to" ).datepicker({
        dateFormat: 'yy-mm-dd',
        defaultDate: "+0d",
        changeMonth: false,
        numberOfMonths: 1,
        minDate: 0,
        onSelect: function( selectedDate ) {
            var option = this.id == "from" ? "minDate" : "maxDate",
                instance = $( this ).data( "datepicker" );
            date = $.datepicker.parseDate(
                instance.settings.dateFormat ||
                $.datepicker._defaults.dateFormat,
                selectedDate, instance.settings );
            dates.not( this ).datepicker( "option", option, date );
        }
    });
});

