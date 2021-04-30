import mongoose from 'mongoose';
import { usersSchema } from "./users-schema";

const Schema = mongoose.Schema;

const eventsSchema = new Schema({
    _id: {type: ObjectId, required: true},
    name: { type: String, required: true},
    users: [usersSchema],
    dates: [Date],
    from: Date,
    to: Date
})

const event = mongoose.model('event', eventsSchema);

export { event };