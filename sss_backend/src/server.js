import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import path from 'path';
import connectToDatabase from './db/db-connect';
import mongoose from 'mongoose';
import * as eventsDao from './db/events-dao';

// Setup Express
const app = express();
const port = process.env.PORT || 3001;

// Setup body-parser
app.use(express.json());
app.use(function (req, res, next) {
    next()
})

// Setup session middleware so we can access session inside of socket instance
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

//Realtime socket implementation listner
io.on("connection", async (socket) => {
    //Once user has connected 
    const session = socket.request.session;
    console.log("User connected");
    socket.on("eventid", (id) => {
        socket.join(id);
    });

    //Handle update of timetable
    socket.on("tableUpdate", async newTimetable => {
        const event = await eventsDao.retrieveEvent(session.event);
        const dbUser = event.users.find(user => user.name === session.name);
        dbUser.timetable = newTimetable;
        await event.save();

        //Send out realtime alert to reupdate event group timetable
        io.to(session.event).emit("update", session.name, newTimetable);
      });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
});

// Start the DB running. Then, once it's connected, start the server.
connectToDatabase()
    .then(() => httpServer.listen(port, () => console.log(`App server listening on port ${port}!`)));