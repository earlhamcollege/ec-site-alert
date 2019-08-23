module.exports = {          
   extend: 'apostrophe-widgets',
   name: 'ec-site-alert',         
   label: 'Site Alerts',
   construct: function(self, options) {

		var superPushAssets = self.pushAssets;
		
		self.pushAssets = function() {
			superPushAssets();
			self.pushAsset('stylesheet', 'alert');
			self.pushAsset('script', 'always', 'always');
			self.pushAsset('script', 'bootstrap.swipe.carousel.min');
		}
	}        
};