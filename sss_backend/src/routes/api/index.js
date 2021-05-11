import express from 'express';

const router = express.Router();

import events from './events';
router.use('/events', events);

export default router;