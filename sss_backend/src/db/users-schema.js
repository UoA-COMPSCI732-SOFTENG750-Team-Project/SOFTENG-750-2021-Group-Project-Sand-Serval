import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    _id: {type: ObjectId, required: true},
    name: { type: String, required: true},
    password: String
})

const user = mongoose.model('user', usersSchema);

export { user };

