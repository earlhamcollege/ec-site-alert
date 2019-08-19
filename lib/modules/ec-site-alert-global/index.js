var async = require('async');
var Promise = require('bluebird');
var _ = require('@sailshq/lodash');

module.exports = {
  improve: 'apostrophe-global',
  construct: function (self, options) {
    options.addFields = [
       {
        name: 'alertLevel',
        type: 'select',
        label: 'Alert Level',
        help: 'Level 1 (Most Urgent) Level 2 (Weather) Level 3 (Important Announcement)',
        choices: 'alertDefaults',
        filters: {
          postType: 'alertDefaults',
          projection: {
              alertTitle: 1,
              alertLevel: 1,
              alertBgColor: 1
          }
        }
      },
      {
        type: 'singleton',
        name: 'ecAlerts',
        widgetType: 'ec-site-alert',
        contextual: true,
        options: {
          limit: 1,
          edit: false,
          currentPage: null
        }
      },
      {
        type: 'array',
        titleField: 'alertTitle',
        name: 'alertDefaults',
        schema: [
          {
            type: 'string',
            name: 'alertTitle',
            label: 'Alert Title'
          },
          {
            type: 'color',
            name: 'alertBgColor',
            label: 'Alert Background Color'
          },
          {
            type: 'color',
            name: 'alertFontColor',
            label: 'Alert Font Color'
          },
          {
            type: 'string',
            name: 'alertIcon',
            label: 'Alert Icon'
          }
        ]
      },
      {
        type: 'boolean',
        name: 'alertDisplay',
        label: 'Display Alert',
        choices: [
          {
            label: 'Every Page',
            value: true
          },
          {
            label: 'Homepage Only',
            value: 'homepage'
          },
          {
            label: 'No',
            value: false
          }
        ]
      },
      {
        name: '_alerts',
        label: 'Selected Alerts',
        type: 'joinByArray',
        withType: 'ec-site-alert',
        titleField: 'alert',
        filter: {
          projection: {
            alertTitle: 1,
            alertIcon: 1,
            alertContent: 1,
            startDate: 1,
            upcoming: 1
          }
        }
      },
      {
        type: 'string',
        textarea: false,
        name: 'alertTitle',
        label: 'Title'
      }
    ].concat(options.addFields || []);
    options.arrangeFields = [
      {
        name: 'alerts',
        label: 'Site Alerts',
        fields: [ 'alertDisplay','alertTitle','alertLevel','_alerts', 'permissionsFields' ]

      },
      {
        name: 'alertDefaults',
        label: 'Alert Default Settings',
        fields: [ 'alertDefaults' ]
      }
    ].concat(options.arrangeFields || []);

    options.arrangeFields = [
      {
        name: 'alertsTab',
        label: 'Site Alerts',
        fields: [ 'alertDisplay','alertTitle','alertLevel','_alerts', 'permissionsFields' ]

      },
      {
        name: 'alertDefaultsTab',
        label: 'Site Alert Default Settings',
        fields: [ 'alertDefaults' ]
      }
    ].concat(options.arrangeFields || []);

      self.alertDefaults = function(req) {
      if (!req.res) {
        // We don't need req for this sample data but make sure it is there
        throw new Error('valid req was not passed to dynamic choices function');
      }

      //console.log(req.data.global.alertDefaults.length);
      // Simulate choices coming from an API
      return Promise.delay(100).then(function() {
        var choices = _.map(_.range(0, req.data.global.alertDefaults.length), function(i) {
          return {
            label: req.data.global.alertDefaults[i].alertTitle || 'Level '+ i,
            value: i+1
          };
        });
        return choices;
      });
    };

    self.generate = function(i) {
      var piece = self.newInstance();
      piece.title = piece.alertTitle;
      piece.published = true;
      return piece;
    };
  }
};