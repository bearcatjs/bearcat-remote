## Bearcat-remote
Bearcat-remote provides rpc remote support wrapped on [Bearcat](https://github.com/bearcatnode/bearcat) and rpc library like [dnode](https://github.com/substack/dnode). It makes it easy to use rpc remote in node.js.  

## Install

```
npm install bearcat-remote --save
```

## Add context.json configuration metadata

```
{
	"name": "bearcat-remote",
	"dependencies": {
	    "bearcat-remote": "*"
	}
}
```

## rpc remote

### Exposing services using dnode
* Exporting the service using the ***dnodeServiceExporter***
Of cource, we first have to set up our service in Bearcat IoC container:  

remoteService.js  
```
var remoteService = function() {

}

remoteService.prototype.remotePing = function(ping, cb) {
	console.log(ping);
	cb('pong');
}

module.exports = remoteService;
```

```
{
	"id": "remoteService",
	"func": "remoteService"
}
```

Next we’ll have to expose our service using the dnodeServiceExporter:  

```
{
	"id": "dnodeServiceExporter",
	"func": "node_modules.bearcat-remote.lib.remote.dnode.dnodeServiceExporter",
	"props": [{
		"name": "service",
		"ref": "remoteService"
	}, {
		"name": "port",
		"value": 8003 
	}, {
		"name": "host",
		"value": "localhost" 
	}]
}
```

* Linking in the service at the client
Exposing our service using the dnodeDynamicProxy:  

```
{
	"id": "dnodeClient",
	"func": "node_modules.bearcat-remote.lib.remote.dnode.dnodeDynamicProxy",
	"init": "dyInit",
	"async": true,
	"destroy": "dyDestroy",
	"props": [{
		"name": "serviceHost",
		"value": "localhost"
	}, {
		"name": "servicePort",
		"value": 8003
	}, {
		"name": "serviceInterface",
		"value": ["remotePing"]
	}]
}
```  

### Startup Bearcat and run it

```
var Bearcat = require('bearcat');

var simplepath = require.resolve('./context.json');
var paths = [simplepath];
var bearcat = Bearcat.createApp(paths);

bearcat.start(function() {
	var dnodeClient = bearcat.getBean('dnodeClient');
	dnodeClient.remotePing('ping', function(msg) {
		console.log(msg); // pong
	});
});
```

## License

(The MIT License)

Copyright (c) fantasyni and other contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.