import express from 'express';
import mongoose from 'mongoose';
import * as eventsDao from '../../db/events-dao';

const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;

const router = express.Router();

//Check for valid ObjectId before anything else
router.use('/:id', async (req, res, next) => {
    const { id } = req.params;
    if (mongoose.isValidObjectId(id)) {
        next();
    }
    else {
        res.status(HTTP_BAD_REQUEST)
            .contentType('text/plain').send('Invalid ID');
    }
});

//Create an event
router.post('/', async (req, res) => {
    if (!req.body.name) {
        res.status(HTTP_BAD_REQUEST)
            .contentType('text/plain').send('Events must have a name');
        return;
    }
    if (!req.body.dates) {
        res.status(HTTP_BAD_REQUEST)
            .contentType('text/plain').send('Events must have a date');
        return;
    }
    const newEvent = await eventsDao.createEvent(req.body);
    res.status(HTTP_CREATED)
        .header('location', `/api/events/${newEvent._id}`)
        .json(newEvent);
});

//Retrive event
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const event = await eventsDao.retrieveEvent(id);
    if (event) {
        res.json(event);
    }
    else {
        res.sendStatus(HTTP_NOT_FOUND);
    }
});

router.post('/:id/sign-in', async (req, res) => {
    const { id } = req.params;
    const {name, password} = req.body;
    if (!name) {
        res.sendStatus(HTTP_BAD_REQUEST);
        return;
    }

    const event = await eventsDao.retrieveEvent(id);
    if (!event){
        res.sendStatus(HTTP_NOT_FOUND);
        return;
    }
    const dbUser = event.users.find(user => user.name === name);
    if (!dbUser) {
        event.users.push({
            name,
            password
        });
        await event.save();
    } else {
        if (dbUser.password && dbUser.password !== password) {
            res.sendStatus(HTTP_FORBIDDEN);
            return;
        }
    }

    req.session.event = id;
    req.session.name = name;
    res.sendStatus(HTTP_OK);
});

export default router;
