window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    var tocLinks = document.querySelectorAll('.toc a');
    var tocSections = [];
    tocLinks.forEach(function(link) {
      var section = document.querySelector(link.getAttribute('href'));
      if (section) {
        tocSections.push({link: link, section: section});
      }
    });

    function updateToc() {
      var current = tocSections[0];
      tocSections.forEach(function(item) {
        if (item.section.getBoundingClientRect().top <= 140) {
          current = item;
        }
      });
      tocLinks.forEach(function(link) {
        link.classList.remove('active');
      });
      if (current) {
        current.link.classList.add('active');
      }
    }

    if (tocSections.length) {
      updateToc();
      window.addEventListener('scroll', updateToc, {passive: true});
    }

    var policyVideos = document.querySelectorAll('.policy-cell-media video');
    if ('IntersectionObserver' in window && policyVideos.length) {
      var policyObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          var video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(function() {});
          } else {
            video.pause();
          }
        });
      }, {root: null, threshold: 0.25});
      policyVideos.forEach(function(video) {
        policyObserver.observe(video);
      });
    }

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    if ($('#interpolation-slider').length) {
      preloadInterpolationImages();

      $('#interpolation-slider').on('input', function(event) {
        setInterpolationImage(this.value);
      });
      setInterpolationImage(0);
      $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);
    }

    bulmaSlider.attach();

})
