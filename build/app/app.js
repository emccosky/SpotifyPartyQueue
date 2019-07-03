"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app_config_service_1 = require("./services/app-config.service");
var app = express();
var client_id = 'b0e2c828e2bf46b4bd3ff63de8157a57'; // Your client id
var client_secret = 'd0b92cd7d4c14d45b4f7119f5a1d81a2'; // Your secret
var redirect_uri = 'http://localhost:8888/callback/'; // Your redirect uri
var configService = new app_config_service_1.AppConfigService();
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
