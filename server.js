const express = require('express');
const app = express();
const path = require('path')
const Twitter = require('twitter');
const config = require('./config.js');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const chalk = require('chalk');


/**
 * Settings
 */
app.use(express.static(__dirname + '/src/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));
app.set('port', 3000);

/**
 * Twitter
 */
const client = new Twitter(config.twitter);

/**
 * Main page
 */
app.get('/', (req, res) => {
    return res.render('index', { config });
})

/**
 * Stream tweet pages
 */
app.get('/streamTweets', function (req, res) {
    res.set('Content-Type', 'application/javascript');
    client.stream('statuses/filter', { track: req.params('keyword') }, (stream) => {
        stream.on('data', (event) => res.send(JSON.stringify(event)));
        stream.on('error', (error) => console.log(error));
    });
})

/**
 * Web Sockets
 */
io.on('connection', (socket) => {

    /**
     * Cuando haya una conexion nueva
     */
    socket.on('streamTweets', function ({ keyword }) {
        console.log(chalk.magentaBright(`[?] Inicio de streaming para "${keyword}"`));

        // Iniciar streaming con la API de Twitter
        stream = client.stream('statuses/filter', { track: keyword });

        // Cuando haya un nuevo tweet
        stream.on('data', (tweet) => {
            console.log(`${chalk.blueBright('@' + tweet.user.screen_name)} ${tweet.text}`);
            io.emit('tweets', JSON.stringify(tweet));
        });

        // Si hay un error
        stream.on('error', (error) => console.error(chalk.bgRed('[!] Ha sucedido un error'), error));
    });

    /**
     * Cuando se desconecte el usuario
     */
    socket.on('disconnect', () => console.log(chalk.magenta('[!] Se ha desconectado el usuario')));

    /**
     * Cuando se desconecte el streaming
     */
    socket.on('stopStreamTweets', () => {
        console.log(chalk.yellow(`[!] Se ha parado el streaming`));
        io.emit('stop');
        stream.destroy();
    });
});

/**
 * Listening
 */
http.listen(app.get('port'), () => {
    console.log(`> Trender está corriendo a través de http://localhost:${app.get('port')}`)
})