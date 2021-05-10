import {split} from '../AppContextProvider';

describe('Test `split(timeSlot, ...splitDates)', () => {
    const date200 = new Date(200000000000);
    const date250 = new Date(250000000000);
    const date300 = new Date(300000000000);
    const date400 = new Date(400000000000);
    const date500 = new Date(500000000000);

    let timeSlot;

    const timeSlotWithUsers = {
        ...timeSlot,
        users: []
    }

    beforeEach(() => {
        timeSlot = {
            startDate: date200,
            endDate: date400,
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
});