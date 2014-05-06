var lib = process.env.BEARCAT_REMOTE_COV ? 'lib-cov' : 'lib';

var should = require('should');
var Bearcat = require('bearcat');
var DnodeDynamicProxy = require('../../' + lib + '/remote/dnode/dnodeDynamicProxy');
var DnodeServiceExporter = require('../../' + lib + '/remote/dnode/dnodeServiceExporter');

describe('domainDaoSupport', function() {
	var simplepath = require.resolve('../../test-context.json');
	var paths = [simplepath];
	var bearcat = Bearcat.createApp(paths);

	before(function(done) {
		bearcat.start(function() {
			done();
		});
	});

	describe('bearcatRemote', function() {
		it('should get ping bearcatRemote right', function(done) {
			var dnodeClient = bearcat.getBean('dnodeClient');
			dnodeClient.remotePing('ping', function(msg) {
				msg.should.eql('pong');

				done();
			});
		});
	});

	describe('DnodeDynamicProxy', function() {
		it('should DnodeDynamicProxy right', function(done) {
			var dnodeDynamicProxy = new DnodeDynamicProxy();
			dnodeDynamicProxy.dyInit();

			dnodeDynamicProxy.serviceHost = 'localhost';
			dnodeDynamicProxy.servicePort = 8003;
			dnodeDynamicProxy.serviceInterface = 'a';
			dnodeDynamicProxy.dyInit();

			dnodeDynamicProxy.serviceInterface = ['dyInit'];

			dnodeDynamicProxy.dyInit();

			dnodeDynamicProxy.serviceInterface = ['remotePing'];

			dnodeDynamicProxy.dyInit(function() {
				dnodeDynamicProxy.dyDestroy();
				done();
			});
		});
	});

	describe('DnodeServiceExporter', function() {
		it('should DnodeServiceExporter right', function(done) {
			var dnodeServiceExporter = new DnodeServiceExporter();
			dnodeServiceExporter.init();

			done();
		});
	});
});