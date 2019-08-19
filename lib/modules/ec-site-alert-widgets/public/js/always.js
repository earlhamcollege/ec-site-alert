apos.define('ec-site-alert-widgets', {
	extend: 'apostrophe-widgets',
	beforeConstruct: function(self, options){
	},
	construct: function(self, options) {
    	self.play = function($widget, data, options) {
    		  $widget.find('#alertButton .collapse')
                .on('shown.bs.collapse', function() {
                    $(this)
                        .parent()
                        .find(".fa-angle-up")
                        .removeClass("fa-angle-up")
                        .addClass("fa-angle-down");
                })
                .on('hidden.bs.collapse', function() {
                    $(this)
                        .parent()
                        .find(".fa-angle-down")
                        .removeClass("fa-angle-down")
                        .addClass("fa-angle-up");
                });
    	}
  	}
});