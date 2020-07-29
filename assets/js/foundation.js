(function ($, Drupal, drupalSettings) {
  'use strict';

  Drupal.behaviors.foundation = {
    attach: function (context, settings) {
      /**
       * When page is loaded
       */
      $('body').addClass('page-animate');

      /**
       * Locations block - display image as background image
       */
        $('.block-views-blocklocations-block-1 .views-row').each(function() {
            var src = $(this).find('.views-field-field-image img').attr('src');

            $(this).find('.views-field-field-image').css({
                'background-image': 'url(' + src + ')'
            });
        });

      /**
       * Toggle responsive navigation
       */
      $('.navigation-toggler').on('click', function() {
          $('#header .block.block-menu.navigation').toggleClass('open');
      });

      /**
       * Listing gallery
       */
      $('.field--name-field-gallery').owlCarousel({
        items: 1,
        nav: true,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
      });
      $('.field--name-field-gallery').addClass('owl-carousel')

      /**
       * Hero search fields
       */
      
      $('#block-home-search-form input').focusin(function() {
        $('label[for="' + $(this).attr('id') + '"]').addClass('hide');
      });


      $('#block-home-search-form input').on('focusout', function() {                        
        if ($(this).val().length === 0) {
          $(this).closest('div').find('label').removeClass('hide');
        }        
      });

      /**
      * Smooth scroll to top
      */
      $('#to-top').on('click', function(e) {
        e.preventDefault();

        $('html,body').animate({
          scrollTop: 0
        }, 1200);
      });
    }
  }; 
})(jQuery, Drupal, drupalSettings);

/**
 * Listing detail Google Map
 */
function initMap() {
  var el = jQuery('#node-listing-map');

  if (el.length != 0) {
    var position = new google.maps.LatLng(el.data('latitude'), el.data('longitude'));
    var mapOptions = {
      zoom: 13,
      scrollwheel: false,
      center: position,
      disableDefaultUI: true,
      styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
    };

    var map = new google.maps.Map(document.getElementById('node-listing-map'), mapOptions);       

    var marker = new google.maps.Marker({
        position: position,
        icon: el.data('icon'),
        map: map
    });

    TxtOverlay.prototype = new google.maps.OverlayView();
    var overlay = new TxtOverlay(position,
        el.data('address'), 
        "map-overlay", 
        map);

  }
}

function TxtOverlay(pos, txt, cls, map) {
  // Now initialize all properties.
  this.pos = pos;
  this.txt_ = txt;
  this.cls_ = cls;
  this.map_ = map;

  this.div_ = null;

  this.onAdd = function() {
      // Note: an overlay's receipt of onAdd() indicates that
      // the map's panes are now available for attaching
      // the overlay to the map via the DOM.

      // Create the DIV and set some basic attributes.
      var div = document.createElement('DIV');
      div.className = this.cls_;

      div.innerHTML = this.txt_;

      // Set the overlay's div_ property to this DIV
      this.div_ = div;
      var overlayProjection = this.getProjection();
      var position = overlayProjection.fromLatLngToDivPixel(this.pos);
      div.style.left = position.x + 'px';
      div.style.top = position.y + 'px';
      // We add an overlay to a map via one of the map's panes.

      var panes = this.getPanes();
      panes.floatPane.appendChild(div);
  }

  this.draw = function() {
      var overlayProjection = this.getProjection();

      // Retrieve the southwest and northeast coordinates of this overlay
      // in latlngs and convert them to pixels coordinates.
      // We'll use these coordinates to resize the DIV.
      var position = overlayProjection.fromLatLngToDivPixel(this.pos);

      var div = this.div_;
      div.style.left = position.x + 'px';
      div.style.top = position.y + 'px';
  }

  this.onRemove = function() {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
  }

  this.hide = function() {
          if (this.div_) {
              this.div_.style.visibility = "hidden";
          }
      }

  this.show = function() {
      if (this.div_) {
          this.div_.style.visibility = "visible";
      }
  }

  this.toggle = function() {
      if (this.div_) {
          if (this.div_.style.visibility == "hidden") {
              this.show();
          } else {
              this.hide();
          }
      }
  }

  this.toggleDOM = function() {
      if (this.getMap()) {
          this.setMap(null);
      } else {
          this.setMap(this.map_);
      }
  }

  // Explicitly call setMap() on this overlay
  this.setMap(map);
}

