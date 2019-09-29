
$('.carousel.carousel-slider').carousel({
  fullWidth: true,
  indicators: true
});

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});