import express from 'express';

const router = express.Router();

import signIn from './signIn';
router.use('/sign-in', signIn);

export default router;