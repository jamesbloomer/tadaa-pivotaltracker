var pivotal = require("pivotal");

var pt = {};

var templates = {
    "OpenBugs" : "type:bug state:unscheduled,unstarted,started,finished,delivered,rejected",
    "OpenFeatures" : "type:feature state:unscheduled,unstarted,started,finished,delivered,rejected"
};

pt._getStories = function(filter, options, callback) {
    console.log('Calling Pivotal Tracker');
    pivotal.useToken(options.token);
    pivotal.getStories(options.projectId, { filter: filter }, function(error, ret) {
        if(error) {
            return callback(error);
        }
        
		console.log('Got %s open stories', ret.story.length);
        return callback(null, ret.story.length);
    });
};

// TODO remove, redundant
pt._getOpenBugs = function(options, callback) {
    var openBugsFilter = "type:bug state:unscheduled,unstarted,started,finished,delivered,rejected";
	return pt._getStories(openBugsFilter, options, callback);
};

pt.getValue = function(options, callback) {
    if(options && options.template) {
        return pt._getStories(templates[options.template], options, callback);
    } else if (options && options.filter) {
        return pt._getStories(options.filter, options, callback);
    } else {
        return pt._getStories(templates["OpenBugs"], options, callback);
    }
};

module.exports = pt;
