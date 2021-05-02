import express from 'express';

const router = express.Router();

import signIn from './signIn';
router.use('/sign-in', signIn);

import events from './events';
router.use('/events', events);

export default router;