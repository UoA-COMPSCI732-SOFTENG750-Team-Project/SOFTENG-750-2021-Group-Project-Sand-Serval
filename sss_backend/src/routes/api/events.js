import express from 'express';
import mongoose from 'mongoose';
import * as eventsDao from '../../db/events-dao';

const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;
const HTTP_BAD_REQUEST = 400;

const router = express.Router();

router.post('/', async (req, res) => {
    if (!req.body.name) {
        res.status(HTTP_BAD_REQUEST)
            .contentType('text/plain').send('Events must have a name');
        return;
    }
    const newEvent = await eventsDao.createEvent(req.body);
    res.status(HTTP_CREATED)
        .header('location', `/api/events/${newEvent._id}`)
        .json(newEvent);

    res.send("ok")
});

export default router;