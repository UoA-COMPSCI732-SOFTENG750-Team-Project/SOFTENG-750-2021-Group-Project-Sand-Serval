import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    _id: {type: Schema.Types.ObjectId, required: true},
    name: { type: String, required: true},
    password: String
})

const eventsSchema = new Schema({
    name: { type: String, required: true},
    users: [usersSchema],
    dates: [Date],
    from: Date,
    to: Date
})

const event = mongoose.model('event', eventsSchema);

export { event };