/*!
 * .______    _______     ___      .______       ______     ___   .__________.
 * (   _  )  (   ____)   /   \     (   _  )     (      )   /   \  (          )
 * |  |_)  ) |  |__     /  ^  \    |  |_)  )   |  ,----'  /  ^  \ `---|  |---`
 * |   _  <  |   __)   /  /_\  \   |      )    |  |      /  /_\  \    |  |
 * |  |_)  ) |  |____ /  _____  \  |  |)  ----.|  `----./  _____  \   |  |
 * (______)  (_______/__/     \__\ ( _| `.____) (______)__/     \__\  |__|
 *
 * Bearcat DnodeDynamicProxy
 * Copyright(c) 2014 fantasyni <fantasyni@163.com>
 * MIT Licensed
 */
var logger = require('pomelo-logger').getLogger('bearcat-remote', 'DnodeDynamicProxy');
var Utils = require('../../util/utils');
var dnode = require('dnode');

var DnodeDynamicProxy = function() {
	this.serviceHost = null;
	this.servicePort = null;
	this.serviceInterface = [];
	this.dnodeClient = null;
	this.targetRemote = null;
}

module.exports = DnodeDynamicProxy;

DnodeDynamicProxy.prototype.dyInit = function(cb) {
	if (!this.serviceHost || !this.servicePort) {
		logger.error('init error service, port or host null...');
		return;
	}

	var serviceInterface = this.serviceInterface;

	if (!Utils.checkArray(serviceInterface)) {
		logger.error('serviceInterface should be interface names array...');
		return;
	}

	var self = this;
	for (var i = 0; i < serviceInterface.length; i++) {
		var method = serviceInterface[i];
		if (checkFuncName(method)) {
			logger.error('init error proxy method interface %j the same as DnodeDynamicProxy, rename this name to another.', method)
			return;
		};

		DnodeDynamicProxy.prototype[method] = function() {
			arguments = Array.prototype.slice.apply(arguments);
			return self.dyInvoke(method, arguments);
		};
	}

	var d = dnode.connect(this.serviceHost, this.servicePort);
	this.dnodeClient = d;
	d.on('remote', function(remote) {
		self.targetRemote = remote;
		cb();
	});
}

DnodeDynamicProxy.prototype.dyInvoke = function(method, args) {
	var targetRemote = this.targetRemote;
	return targetRemote[method].apply(targetRemote, args);
}

DnodeDynamicProxy.prototype.dyDestroy = function() {
	this.dnodeClient.end();
}

var names = ["dyInit", "dyInvoke", "dyDestroy"];

var checkFuncName = function(name) {
	for (var i = 0; i < names.length; i++) {
		if (name === names[i]) {
			return true;
		}
	}

	return false;
}