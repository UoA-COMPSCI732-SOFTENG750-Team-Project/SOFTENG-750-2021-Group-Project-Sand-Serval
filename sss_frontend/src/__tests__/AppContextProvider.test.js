import {split} from '../AppContextProvider';
import { updateTimetable } from '../AppContextProvider';

describe('Test `split(timeSlot, ...splitDates)', () => {
    const date200 = new Date(200000000000);
    const date250 = new Date(250000000000);
    const date300 = new Date(300000000000);
    const date400 = new Date(400000000000);
    const date500 = new Date(500000000000);

    let timeSlot;
    let timeSlotWithUsers;

    let groupTimetables;
    let user1 = "1";
    let user2 = "2";
    let user3 = "3";

    let newTimetables;

    beforeEach(() => {
        timeSlot = {
            startDate: date200,
            endDate: date400,
        };

        timeSlotWithUsers = {
            ...timeSlot,
            users: []
        };

        groupTimetables = [{
            endDate: date400,
            startDate: date200,
            users: [user2],
        }];

        newTimetables = [{

        }];

    })

    it('1 split date within time slot', () => {
        let result = split(timeSlot, date300)
        expect(result.length).toBe(2);
        expect(result[0].startDate).toEqual(date200);
        expect(result[0].endDate).toEqual(date300);
        expect(result[1].startDate).toEqual(date300);
        expect(result[1].endDate).toEqual(date400);
    });

    it('2 split dates within time slot', () => {
        let result = split(timeSlot, date250, date300);
        expect(result.length).toBe(3);
        expect(result[0].startDate).toEqual(date200);
        expect(result[0].endDate).toEqual(date250);
        expect(result[1].startDate).toEqual(date250);
        expect(result[1].endDate).toEqual(date300);
        expect(result[2].startDate).toEqual(date300);
        expect(result[2].endDate).toEqual(date400);
    });

    it('2 split dates within time slot. The first date happens after second date', () => {
        let result = split(timeSlot, date300, date250);
        expect(result.length).toBe(3);
        expect(result[0].startDate).toEqual(date200);
        expect(result[0].endDate).toEqual(date250);
        expect(result[1].startDate).toEqual(date250);
        expect(result[1].endDate).toEqual(date300);
        expect(result[2].startDate).toEqual(date300);
        expect(result[2].endDate).toEqual(date400);
    });

    it('2 split dates, 1 within, 1 after', () => {
        let result = split(timeSlot, date300, date500);
        expect(result.length).toBe(2);
        expect(result[0].startDate).toEqual(date200);
        expect(result[0].endDate).toEqual(date300);
        expect(result[1].startDate).toEqual(date300);
        expect(result[1].endDate).toEqual(date400);
    });

    it('Split at the edge', () => {
        expect(split(timeSlot, date200).length).toBe(1);
        expect(split(timeSlot, date400).length).toBe(1);
    });

    it('In the result, the properties of one time slot can\'t share references with the properties another time slots', () => {
        let result = split(timeSlotWithUsers, date300)
        expect(result[0].users).not.toBe(result[1].users);
        expect(result[0].endDate).not.toBe(result[1].startDate);
    });

    it('test updateTimetable', () => {
        let result = updateTimetable(groupTimetables, user1, newTimetables)
        expect(result[0])
    })
});