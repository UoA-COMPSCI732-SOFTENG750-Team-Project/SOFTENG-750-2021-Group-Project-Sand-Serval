import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import path from 'path';
import connectToDatabase from './db/db-connect';


// Setup Express
const app = express();
const port = process.env.PORT || 3001;

// Setup body-parser
app.use(express.json());
app.use(function (req, res, next) {
    next()
})

// Setup session middleware
var Server = require("http").Server;
var server = Server(app);
var sio = require("socket.io")(server);
var sessionMiddleware = session({ secret: crypto.randomBytes(48).toString('hex') })
sio.use(function(socket, next) {sessionMiddleware(socket.request, {}, next);});
app.use(sessionMiddleware);

// Setup our routes.
import routes from './routes';
app.use('/', routes);

// Make the "public" folder available statically
app.use(express.static(path.join(__dirname, '../public')));

// Serve up the frontend's "build" directory, if we're running in production mode.
if (process.env.NODE_ENV === 'production') {
    console.log('Running in production!');

    // Make all files in that folder public
    app.use(express.static(path.join(__dirname, '../../frontend/build')));

    // If we get any GET request we can't process using one of the server routes, serve up index.html by default.
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
    });
}

sio.sockets.on("connection", function(socket) {
    console.log(socket.request.session) // Now it's available from Socket.IO sockets too! Win!
  });
  
// Start the DB running. Then, once it's connected, start the server.
connectToDatabase()
    .then(() => app.listen(port, () => console.log(`App server listening on port ${port}!`)));