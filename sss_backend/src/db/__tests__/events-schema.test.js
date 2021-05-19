import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { event } from '../events-schema';

let mongod;
let event1, event2;

beforeAll(async () => {

    mongod = new MongoMemoryServer();

    const connectionString = await mongod.getUri();
    await mongoose.connect(connectionString, { useNewUrlParser: true });

});

beforeEach(async () => {
    //const coll = await mongoose.connection.db.createCollection('event');

    event1 = {
        name: "aefasd",
        dates: [new Date('2021-05-10')],
        from: new Date(),
        to: new Date()
    };

    event2 = {
        name: "Test",
        dates: [new Date('2021-05-01'), new Date('2021-05-02'), new Date('2021-05-03'), new Date('2021-05-04')],
        from: new Date('2021-05-21'),
        to: new Date('2019-03-21')
    };

    const coll = [event1, event2];

    await event.insertMany(coll);

    //await coll.insertMany([event1, event2]);
});


afterEach(async () => {
    await event.deleteMany();
});


afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});


it('gets events', async () => {

    const events = await event.find();
    expect(events).toBeTruthy();
    expect(events.length).toBe(2);

    expect(events[0].name).toBe("aefasd");
    expect(events[0].dates[0]).toEqual(new Date('2021-05-10'));

    expect(events[1].name).toBe("Test");
    expect(events[1].dates.length).toBe(4);
    expect(events[1].from).toEqual(new Date('2021-05-21'));
    expect(events[1].to).toEqual(new Date('2019-03-21'));
});