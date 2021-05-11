import mongoose from 'mongoose';

const Schema = mongoose.Schema;

 const timetableSchema = new Schema({
     startDate: Date,
     endDate: Date
 })

const usersSchema = new Schema({
    name: { type: String, required: true},
    password: String,
    timetable: [timetableSchema]
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