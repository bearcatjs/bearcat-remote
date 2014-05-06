/*!
 * .______    _______     ___      .______       ______     ___   .__________.
 * (   _  )  (   ____)   /   \     (   _  )     (      )   /   \  (          )
 * |  |_)  ) |  |__     /  ^  \    |  |_)  )   |  ,----'  /  ^  \ `---|  |---`
 * |   _  <  |   __)   /  /_\  \   |      )    |  |      /  /_\  \    |  |
 * |  |_)  ) |  |____ /  _____  \  |  |)  ----.|  `----./  _____  \   |  |
 * (______)  (_______/__/     \__\ ( _| `.____) (______)__/     \__\  |__|
 *
 * Bearcat DnodeServiceExporter
 * Copyright(c) 2014 fantasyni <fantasyni@163.com>
 * MIT Licensed
 */
var logger = require('pomelo-logger').getLogger('bearcat-remote', 'DnodeServiceExporter');
var Utils = require('../../util/utils');
var dnode = require('dnode');

var DnodeServiceExporter = function() {
	this.service = null;
	this.port = null;
	this.host = null;
}

module.exports = DnodeServiceExporter;

DnodeServiceExporter.prototype.init = function() {
	if (!this.service || !this.port || !this.host) {
		logger.error('init error service, port or host null...');
		return;
	}

	var targetService = this.service;
	var targetMethod = {};

	for (var method in targetService) {
		if (Utils.checkFunction(targetService[method])) {
			targetMethod[method] = targetService[method];
		}
	}

	var server = dnode(targetMethod);

	server.listen(this.port);
	logger.info('dnode server started in: ' + this.port);
}