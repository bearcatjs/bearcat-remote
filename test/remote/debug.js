var lib = process.env.BEARCAT_REMOTE_COV ? 'lib-cov' : 'lib';

var Bearcat = require('bearcat');

var simplepath = require.resolve('../../test-context.json');
var paths = [simplepath];
var bearcat = Bearcat.createApp(paths);

bearcat.start(function() {
	var dnodeClient = bearcat.getBean('dnodeClient');
	dnodeClient.remotePing('ping', function(msg) {
		msg.should.eql('pong');
	});
});