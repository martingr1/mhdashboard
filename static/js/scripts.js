$('#reset_button').click(function() {
    dc.filterAll();
    dc.renderAll();
});

$('.hide-btn').click(function() {
    $(this).parent().nextAll('.hide-content-toggle').slideToggle();
    $(this).parent().parent().parent().toggleClass('eq-column-height');
    $(this).toggleClass('fa-angle-down');
    $(this).toggleClass('fa-angle-up');
});
