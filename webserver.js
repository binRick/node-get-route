#!/usr/bin/env node

var express = require('express'),
    snmp = require('snmp-native'),
    app = express(),
    config = require('./config'),
    c = require('chalk'),
    NodeCache = require('node-cache'),
    myCache = new NodeCache();

app.get('/route/:ip', function(req, res) {
	var host='car1';
	var session = new snmp.Session(config.hosts[host]);
	res.send(req.params.ip);
});

app.listen(config.port, function() {
    console.log(c.white.bold('Webserver listening on port'), c.red(config.port));
});
