import {split, updateTimetable} from '../AppContextProvider';

const date200 = new Date(200000000000);
const date250 = new Date(250000000000);
const date300 = new Date(300000000000);
const date350 = new Date(350000000000);
const date400 = new Date(400000000000);
const date500 = new Date(500000000000);

describe('Test `split(timeSlot, ...splitDates)', () => {
    let timeSlot;
    let timeSlotWithUsers;

    beforeEach(() => {
        timeSlot = {
            startDate: date200,
            endDate: date400,
        };

        timeSlotWithUsers = {
            ...timeSlot,
            users: []
        };
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

    
});

describe('Test `updateTimetable(groupTimetables, users, newTimetables)', () => {
    let emptyGroupTimetables;
    let groupTimetables;
    let newTimetables1;
    let newTimetables2;

    let user1 = "1";
    let user2 = "2";

    beforeEach(() => {
        emptyGroupTimetables = [];

        groupTimetables = [{
            startDate: date250,
            endDate: date350,
            users: [user2],
        }];

        newTimetables1 = [{
            startDate: date300,
            endDate: date400,
        }];

        newTimetables2 = [{
            startDate: date400,
            endDate: date500,
        }];
    });

    it('Adding to an empty group timetable', () => {
        let result = updateTimetable(emptyGroupTimetables, user1, newTimetables1);
        expect(result.length).toBe(1);
        expect(result[0]).toStrictEqual({
            users: [user1],
            startDate: date300,
            endDate: date400,
        });
    });

    it('Adding different users with no overlap', () => {
        let result = updateTimetable(groupTimetables, user1, newTimetables2);
        expect(result.length).toBe(2);
    });

    it('Adding different users with overlap', () => {
        let result = updateTimetable(groupTimetables, user1, newTimetables1);
        expect(result.length).toBe(3);
    });

    it('Check if slot is merge back after broken out from last test', () => {
        let newGroupTimetables = updateTimetable(groupTimetables, user1, newTimetables1);
        let result = updateTimetable(newGroupTimetables, user1, []);
        expect(result.length).toBe(1);
    });

    it('User change their timetable', () => {
        let result = updateTimetable(groupTimetables, user2, newTimetables1);
        expect(result.length).toBe(1);
        expect(result[0]).toStrictEqual({
            users: [user2],
            startDate: date300,
            endDate: date400,
        });
    });
});
