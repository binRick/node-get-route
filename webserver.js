#!/usr/bin/env node

var express = require('express'),
    c = require('chalk'),
    async = require('async'),
    _ = require('underscore'),
    snmp = require("net-snmp"),
    config = require('./config'),
    app = express(),
    routerSessions = [];

_.each(_.keys(config.hosts), function(h) {
    routerSessions.push({
        router: h,
        session: new snmp.Session(config.hosts[h].host, config.hosts[h].community)
    });
});

app.get('/route/:ip', function(req, res) {
    var oids = ['1.3.6.1.2.1.4.21.1.7.' + req.params.ip];
    async.mapLimit(routerSessions, 5, function(routerSession, _cb) {
            routerSession.session.get(oids, function(err, snmpResults) {
                if (err)
                    var route = null;
                else
                    var route = snmpResults[0].value.toString();
                _cb(null, {
                    router: routerSession.router,
                    route: route
                });
            });
        },
        function(err, Routes) {
            if (err) throw err;
            res.json(Routes);
        });
});

app.listen(config.port, '0.0.0.0', function() {
    console.log(c.white.bold('Webserver listening on port'), c.red(config.port));
});
