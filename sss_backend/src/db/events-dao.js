import { event } from "./events-schema";

export async function createEvent(Event) {
    const dbEvent = new event(Event);
    await dbEvent.save();
    return dbEvent;
}

export async function retrieveEvent(id) {
    return await event.findById(id);
}