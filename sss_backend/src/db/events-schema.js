import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    name: { type: String, required: true},
    password: String
})

const eventsSchema = new Schema({
    name: {type: String, required: true},
    users: [usersSchema],
    dates: [{type: Date, required: true}],
    from: Date,
    to: Date
})

const event = mongoose.model('event', eventsSchema);

export { event };