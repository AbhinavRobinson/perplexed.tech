const fs = require('fs');
const https = require('https');
const express = require('express');

const app = express();

const privateKey = fs.readFileSync('/etc/letsencrypt/live/perplexed.tech/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/perplexed.tech/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/perplexed.tech/chain.pem', 'utf8');

const port = 80

app.enable('trust proxy')

app.use(function (req, res, next) {
    if (req.secure) {
        next();
    } else {
        res.redirect('https://' + req.headers.host + req.url);
    }
})

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

app.use('/',express.static('static'));

app.listen(port, () => console.log(`Listening on the ${port}`))
https.createServer(credentials, app).listen(443)
