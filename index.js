module.exports = {        
	name: 'ec-site-alert',        
   	extend: 'apostrophe-pieces',      
	label: 'Site Alert',        
	pluralLabel: 'Site Alerts',
	moogBundle: {
    	modules: ['apostrophe-global','ec-site-alert-widgets'],
    	directory: 'lib/modules'
  	},        
    beforeConstruct: function(self, options) {
    	options.sort = { startDate: 1, startTime: 1 };
    	options.addFields = [
			{
				name: 'startDate',
				label: 'Date',
				type: 'date',
				required: true
			},
			{
			    name: 'allDay',
			    label: 'Is this an all day event?',
			    type: 'boolean',
			    choices: [
			        { label: 'Yes', value: true },
			        { label: 'No', value: false , showFields: ['startTime', 'endTime'] }
			    ],
			    def: false
			  },
			  {
				name: 'startTime',
			    label: 'Start Time',
			    type: 'time',
			    def: '09:00:00',
			    required: true
			},
			{
            	name: 'endTime',
            	label: 'End Time',
            	type: 'time',
            	def: '17:30:00',
            	required: true
      		},
      		{
            	name: 'endDate',
            	label: 'End Date',
            	type: 'date'
          	},
      		{
            	name: 'dateType',
            	label: 'What type of event is this?',
            	type: 'select',
            	choices: [
	              { label: 'Single Day', value: 'single' },
	              { label: 'Consecutive Days', value: 'consecutive', showFields: ['endDate'] }
	            ],
	            def: 'single'
	        },
	          {
	              type: 'string',
	              name: 'alertIcon',
	              label: 'Alert Icon'
	          },
	          {
	              type: 'string',
	              name: 'alertContent',
	              label: 'Content',
	              textarea: true
	          }
	    ].concat(options.addFields || []);
		
		options.arrangeFields = options.arrangeFields || [
        	{ name: 'basic', label: 'Basics', fields: ['title','alertIcon','alertContent','startDate', 'allDay', 'startTime', 'endTime', 'locations', 'dateType', 'endDate', 'repeatInterval', 'repeatCount'] },
        	{ name: 'meta', label: 'Meta', fields: ['slug','tags','published'] }
      	].concat(options.arrangeFields || []);
    },
  	construct: function(self, options) {
	    var superWidgetCursor = self.widgetCursor;
	    
	    self.widgetCursor = function(req, criteria) {
	      return superWidgetCursor(req, criteria).upcoming(true);
	    };
	        // limit the results of autocomplete for joins
	    // so they only include upcoming events
	    self.extendAutocompleteCursor = function(cursor) {
	      return cursor.upcoming(true);
	    };

	    self.beforeSave = function(req, piece, options, callback) {
	      self.denormalizeDatesAndTimes(piece);
	      return callback(null);
	    };

	    self.afterInsert = function(req, piece, options, callback) {
	      if(piece.dateType == 'repeat') {
	        return self.repeatEvent(req, piece, callback);
	      } else {
	        return callback(null);
	      }
	    };

	    self.denormalizeDatesAndTimes = function(piece) {
	      // Parse our dates and times
	      var startTime = piece.startTime
	        , startDate = piece.startDate
	        , endTime = piece.endTime
	        , endDate;

	      if(piece.dateType == 'consecutive') {
	        endDate = piece.endDate;
	      } else {
	        piece.endDate = piece.startDate;
	        endDate = piece.startDate;
	      }

	      if(piece.allDay) {
	        startTime = '00:00:00';
	        endTime = '23:59:59';
	      }

	      if(piece.dateType == 'repeat') {
	        piece.hasClones = true;
	      }

	      piece.start = new Date(startDate +' '+ startTime);
	      piece.end = new Date(endDate +' '+ endTime);
	    };

	    self.repeatEvent = function(req, piece, finalCallback) {
	      var i
	        , repeat = parseInt(piece.repeatCount) + 1
	        , multiplier = piece.repeatInterval
	        , addDates = [];

	      for(i = 1; i < repeat; i++) {
	        addDates.push(moment(piece.startDate).add(i, multiplier).format('YYYY-MM-DD'));
	      }

	      return async.eachLimit(addDates, 5, function(date, callback) {
	        var eventCopy = _.cloneDeep(piece);
	        eventCopy._id = self.apos.utils.generateId();
	        eventCopy.parentId = piece._id;
	        eventCopy.isClone = true;
	        eventCopy.startDate = date;
	        eventCopy.endDate = date;
	        eventCopy.slug = eventCopy.slug + '-' + date;
	        eventCopy.dateType = 'single';
	        self.denormalizeDatesAndTimes(eventCopy);
	        return self.insert(req, eventCopy, callback);
	      }, finalCallback);
		};      
    }   
}