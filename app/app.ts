import express = require('express');
import request = require('request');
import cors = require('cors');
import querystring = require('query-string');
import cookieParser = require('cookie-parser');

import {
    AppConfigService
} from './services/app-config.service'

var generateRandomString = function(length: number) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const app: express.Application = express();
app.use(express.static('public'))
    .use(cors())
    .use(cookieParser());
var stateKey = 'spotify_auth_state';

var configService: AppConfigService = new AppConfigService();

const client_id = configService.getClientId();
const client_secret = configService.getClientSecret();
var redirect_uri = 'http://localhost:3000/callback/'; // Your redirect uri

app.get('/', function(req, res) {
    res.send('Hello World!');
});

// ===== SPOTIFY LOGIN =====
app.get('/login', function(req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    var scope = 'user-modify-playback-state user-read-recently-played playlist-read-collaborative playlist-modify-public';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
        console.log('Login good');
});

// ===== DASHBOARD =====
app.get('/callback', function(req, res) {
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        console.log('State good');
        res.clearCookie(stateKey);
        var auth = 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64');
        
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': auth
            },
            json: true
        };

        console.log(authOptions);

        request.post(authOptions, function(error, response, body) {
            console.log('Returned status code ' + response.statusCode);
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token,
                    refresh_token = body.refresh_token;
                
                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    json: true
                }

                request.get(options, function(error, response, body) {
                    console.log(body);
                });

                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' + 
                    querystring.stringify({
                    error: 'invalid_token'
                  }));
            }
        });
    }
});

app.get('/playlists', function(req, res) {
    // request.post(authOptions, function(error, response, body) {
    //     console.log('Returned status code ' + response.statusCode);
    //     if (!error && response.statusCode === 200) {
    //         var access_token = body.access_token,
    //             refresh_token = body.refresh_token;
            
    //         var options = {
    //             url: 'https://api.spotify.com/v1/me/playlists',
    //             headers: {
    //                 'Authorization': 'Bearer' + access_token
    //             },
    //             json: true
    //         }

    //         request.get(options, function(error, response, body) {
    //             console.log(body);
    //         });

    //         res.redirect('/#' +
    //             querystring.stringify({
    //                 access_token: access_token,
    //                 refresh_token: refresh_token
    //             }));
    //     } else {
    //         res.redirect('/#' + 
    //             querystring.stringify({
    //             error: 'invalid_token'
    //           }));
    //     }
    // });
})

// ===== TOKEN REFRESH =====
app.get('/refresh-token', function(req, res) {

    var refresh_token = req.query.refresh_token;
    console.log(refresh_token);
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            console.log(access_token);
            res.send({
                'access_token': access_token
            });
        }
    });

});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});