apos.define('ec-site-alert-widgets', {
	extend: 'apostrophe-widgets',
	beforeConstruct: function(self, options){
	},
	construct: function(self, options) {
    	self.play = function($widget, data, options) {

    		  $widget.find('#collapseExample')
                .on('show.bs.collapse', function() {
                    $(this)
                        .parent()
                        .find(".fa-angle-down")
                        .removeClass("fa-angle-down")
                        .addClass("fa-angle-up");
                })
                .on('hide.bs.collapse', function() {
                    $(this)
                        .parent()
                        .find(".fa-angle-up")
                        .removeClass("fa-angle-up")
                        .addClass("fa-angle-down");
                });
            $('#carouselExampleIndicators').carousel('pause').swipeCarousel({sensitivity: 'high'});
    	}
  	}
});