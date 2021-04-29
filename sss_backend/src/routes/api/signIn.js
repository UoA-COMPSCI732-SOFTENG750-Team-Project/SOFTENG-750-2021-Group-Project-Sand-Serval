import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    res.status(200)
        .json({message: `${req.body.name} logged in successfully`});
});

export default router;