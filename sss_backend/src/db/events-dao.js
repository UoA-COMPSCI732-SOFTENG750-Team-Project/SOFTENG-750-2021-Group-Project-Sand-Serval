import { event } from "./events-schema";

export async function createEvent(todo) {
    const dbEvent = new event(todo);
    await dbEvent.save();
    return dbEvent;
}

export async function retrieveEvent(id) {
    return await event.findById(id);
}