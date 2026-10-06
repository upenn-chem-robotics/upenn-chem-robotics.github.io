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
      var MAX_LOOPS = 5; // stop auto-looping after N iterations to avoid long-run decoder exhaustion

      // Preload videos just before they scroll into view so the first frame is ready.
      var preloadObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var video = entry.target;
            if (video.preload !== 'auto') {
              video.preload = 'auto';
              try { video.load(); } catch (e) {}
            }
            preloadObserver.unobserve(video);
          }
        });
      }, {root: null, rootMargin: '200px 0px', threshold: 0});

      // Only play videos actually in the viewport. Pause everything else so the
      // browser isn't decoding 12 streams at once (which causes stutter over time).
      var playObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          var video = entry.target;
          if (entry.isIntersecting) {
            if (!video.dataset.stopped) {
              video.play().catch(function() {});
            }
          } else {
            video.pause();
          }
        });
      }, {root: null, threshold: 0.5});

      // Count loops. After MAX_LOOPS, stop autoplay and show a replay affordance.
      // Clicking the tile restarts the loop counter.
      policyVideos.forEach(function(video) {
        video.dataset.loops = '0';
        var cell = video.closest('.policy-cell-media');

        video.addEventListener('ended', function() {
          var n = parseInt(video.dataset.loops || '0', 10) + 1;
          video.dataset.loops = String(n);
          if (n >= MAX_LOOPS) {
            video.loop = false;
            video.dataset.stopped = '1';
            if (cell) cell.classList.add('policy-cell-media--stopped');
            video.pause();
          } else {
            // keep looping manually (we removed native loop so we can count)
            video.currentTime = 0;
            video.play().catch(function() {});
          }
        });

        // Disable native loop so 'ended' fires each iteration.
        video.loop = false;

        if (cell) {
          cell.addEventListener('click', function(e) {
            if (video.dataset.stopped) {
              e.preventDefault();
              video.dataset.loops = '0';
              delete video.dataset.stopped;
              cell.classList.remove('policy-cell-media--stopped');
              video.currentTime = 0;
              video.play().catch(function() {});
            }
          });
        }

        preloadObserver.observe(video);
        playObserver.observe(video);
      });

      // Pause everything when the tab is hidden; resume visible ones when it returns.
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          policyVideos.forEach(function(v) { v.pause(); });
        } else {
          policyVideos.forEach(function(v) {
            if (v.dataset.stopped) return;
            var r = v.getBoundingClientRect();
            var inView = r.top < window.innerHeight && r.bottom > 0;
            if (inView) v.play().catch(function() {});
          });
        }
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
