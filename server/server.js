#!/usr/bin/env node

var path = require('path');
var httpProxy = require('http-proxy');
var express = require('express');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'wetlab'});
var app = express();

var options = {
	target:'https://secure.transcriptic.com',
	changeOrigin: true,
	xfwd:true
}
var proxy = httpProxy.createProxyServer(options);

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});

// app.use(require('express-bunyan-logger')());
app.use(require('express-bunyan-logger').errorLogger());

app.get("/transcriptic*", function(req, res) {
	res.oldWriteHead = res.writeHead;
	req.url = req.url.replace('/transcriptic', '');
	req.url = req.url.replace('//', '/');
	res.writeHead = function(statusCode, headers) {
		/* add logic to change headers here */
		res.setHeader('Access-Control-Accept-Origin', '*');
		res.setHeader('Host', 'secure.transcriptic.com');
		res.setHeader('Accept', 'application/json');
		res.oldWriteHead(statusCode, headers);
	}
	proxy.web(req, res, options);
});

log.info('process.env.APP=' + process.env.APP);
var appFolder = (process.env.APP || path.dirname(__dirname)) + '/dist';
log.warn('appFolder=' + appFolder);
app.use(express.static(appFolder));

var port = process.env.PORT || 9000;

var server = app.listen(port, '0.0.0.0', function () {

  var host = server.address().address;
  var port = server.address().port;

  log.info('Example app listening at http://boot2docker:%s', port);

});

process.on( 'SIGINT', function() {
  log.warn( "\nGracefully shutting down from SIGINT (Ctrl-C)");
  // some other closing procedures go here
  server.close();
  process.exit(0);
})

