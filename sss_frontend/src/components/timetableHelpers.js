import {useState} from 'react';

export const useNavigator = (startDate, endDate) => {
    const [currentDate, setCurrentDate] = useState(startDate);
    return [currentDate, newDate => {
        if (newDate.getTime() < startDate.getTime()) {
            setCurrentDate(startDate);
        } else if (newDate.getTime() > endDate.getTime()) {
            setCurrentDate(endDate);
        } else {
            setCurrentDate(newDate);
        }
    }];
};

export const isTimeTableCellDisabled = (event, timeSlot) => {
    return compareToDayOfTheMonth(timeSlot.startDate, event.dates[0]) === -1 ||
        compareToDayOfTheMonth(timeSlot.endDate, event.dates[1]) === 1 ||
        compareUpToHourMinute(timeSlot.startDate, event.from) === -1 ||
        compareUpToHourMinute(timeSlot.endDate, event.to) === 1;
};

// 1 if the first date is after the second, -1 if the first date is before the second or 0 if dates are equal.
// Compare up to the day of the month (not hours, seconds,...)
function compareToDayOfTheMonth(date1, date2) {
    const aDayInMilli = 24 * 60 * 60 * 1000;
    if (date1.getTime() - date2.getTime() > aDayInMilli) {
        return 1;
    } else if (date2.getTime() - date1.getTime() > aDayInMilli) {
        return -1;
    } else if (date1.getDate() > date2.getDate()) {
        return 1;
    } else if (date2.getDate() > date1.getDate()) {
        return -1;
    } else {
        return 0;
    }
}

function compareUpToHourMinute(time1, time2) {
    let time1HourMinuteMilli = (((time1.getHours() * 60) + time1.getMinutes()) * 60 + time1.getSeconds()) *
        1000 + time1.getMilliseconds();
    let time2HourMinuteMilli = (((time2.getHours() * 60) + time2.getMinutes()) * 60 + time2.getSeconds()) *
        1000 + time2.getMilliseconds();
    if (time1HourMinuteMilli > time2HourMinuteMilli) {
        return 1;
    } else if (time2HourMinuteMilli > time1HourMinuteMilli) {
        return -1;
    } else {
        return 0;
    }
}
