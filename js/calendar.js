define([
  'lodash',
  'dojo/dom',
  'dojo/date/locale',
  'dojo/request/script',
  './lodash.template',
  'dojo/domReady!'
], function(_, dom, date, request){

  'use strict';

  var url = 'http://www.google.com/calendar/feeds/heatsynclabs.org_p9rcn09d64q56m7rg07jptmrqc@group.calendar.google.com/public/full';

  var calendarEntries = dom.byId('calendar-entries');

  request.get(url, {
    jsonp: 'callback',
    query: {
      alt: 'json',
      orderby: 'starttime',
      'max-results': 10,
      singleevents: true,
      sortorder: 'ascending',
      futureevents: true
    }
  }).then(function(data){
    var entries = _.map(data.feed.entry, function(entry){
      var importantProps = _.pick(entry, 'content', 'gd$when', 'link', 'title');

      var eventDate = new Date(importantProps.gd$when[0].startTime);

      return {
        content: importantProps.content.$t,
        date: date.format(eventDate, {
          selector: 'date',
          datePattern: 'EEEE, MMMM d'
        }),
        time: date.format(eventDate, {
          selector: 'time',
          timePattern: 'K:mm a'
        }),
        link: _.find(importantProps.link, { type: 'text/html' }).href,
        title: importantProps.title.$t
      };
    });

    calendarEntries.innerHTML = _.templates.calendar({
      dates: _.pluck(entries, 'date'),
      entries: entries
    });
  }, function(err){
    console.log('Error in Calendar', err);
    // TODO: template an error message
    calendarEntries.innerHTML = 'Error Loading Calendar - Please Refresh the Page';
  });

});
