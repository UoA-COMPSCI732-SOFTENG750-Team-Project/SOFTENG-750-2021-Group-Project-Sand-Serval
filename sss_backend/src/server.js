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
const httpServer = require("http").createServer(app);
const options = { /* ... */ };
const io = require("socket.io")(httpServer, options);
var sessionMiddleware = session({ secret: crypto.randomBytes(48).toString('hex') })
io.use(function(socket, next) {sessionMiddleware(socket.request, {}, next);});
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

//This is a test for socket connection
let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
  };
// sio.sockets.on("connection", function(socket) {
//     console.log(socket.request.session) // Now it's available from Socket.IO sockets too! Win!
//   });

// Start the DB running. Then, once it's connected, start the server.
connectToDatabase()
    .then(() => httpServer.listen(port, () => console.log(`App server listening on port ${port}!`)));