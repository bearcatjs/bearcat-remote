var BearcatDnodeRemoteService = function() {

}

BearcatDnodeRemoteService.prototype.remotePing = function(ping, cb) {
	console.log(ping);
	cb('pong');
}

module.exports = BearcatDnodeRemoteService;