var mocha = require('mocha'),
	assert = require('assert'),
	sinon = require('sinon'),
	pivotal = require("pivotal"),
	index = require('../index.js');

describe('Tadaa Pivotal Tracker Tests', function() {
	describe('when getValue called (pivotal methods check)', function() {
		beforeEach(function() {
			sinon.stub(pivotal, 'useToken');
			sinon.stub(pivotal, 'getStories').yields(null, { story : { length : 1 } });
		});

		afterEach(function() {
			pivotal.useToken.restore();
			pivotal.getStories.restore();
		});

		it('should call pivotal methods', function(done) {
			index._getStories('FILTER', { token: "myToken", projectId: "projectId" }, function(err) {
				assert(pivotal.useToken.calledWith('myToken'));
				assert(pivotal.getStories.calledWith('projectId', { filter: "FILTER" }));
				done();
			});
		});
	});

	describe('when getValue called', function() {
		beforeEach(function() {
			sinon.stub(index, '_getStories');
			sinon.stub(pivotal, 'useToken');
			sinon.stub(pivotal, 'getStories').yields(null, { story : { length : 1 } });
		});

		afterEach(function() {
			index._getStories.restore();
			pivotal.useToken.restore();
			pivotal.getStories.restore();
		});

		it('should default to getting open bugs if not filter passed in options', function(done) {
			index._getStories.yields();
			var options = {};
			index.getValue(options, function() {
				assert(index._getStories.calledOnce);
				assert.equal(index._getStories.args[0][0], 'type:bug state:unscheduled,unstarted,started,finished,delivered,rejected');
				assert.deepEqual(index._getStories.args[0][1], options);
				return done();
			});
		});

		it('should use filter if in options', function(done) {
			index._getStories.yields();
			var options = { filter: "FILTER" };
			index.getValue(options, function() {
				assert(index._getStories.calledOnce);
				assert.equal(index._getStories.args[0][0], 'FILTER');
				assert.deepEqual(index._getStories.args[0][1], options);
				return done();
			});
		});

		it('should use correct filter if template in options and is OpenBugs', function(done) {
			index._getStories.yields();
			var options = { template: "OpenBugs", filter: "FILTER" };
			index.getValue(options, function() {
				assert(index._getStories.calledOnce);
				assert.equal(index._getStories.args[0][0], 'type:bug state:unscheduled,unstarted,started,finished,delivered,rejected');
				assert.deepEqual(index._getStories.args[0][1], options);
				return done();
			});
		});

		it('should use correct filter if template in options and is OpenFeatures', function(done) {
			index._getStories.yields();
			var options = { template: "OpenFeatures", filter: "FILTER" };
			index.getValue(options, function() {
				assert(index._getStories.calledOnce);
				assert.equal(index._getStories.args[0][0], 'type:feature state:unscheduled,unstarted,started,finished,delivered,rejected');
				assert.deepEqual(index._getStories.args[0][1], options);
				return done();
			});
		});
	});
});