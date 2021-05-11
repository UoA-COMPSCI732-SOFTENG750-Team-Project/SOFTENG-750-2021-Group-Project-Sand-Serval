import React, {useEffect, useState} from 'react';
import useStateWithCallback from './hooks/useStateWithCallback';
import socketIOClient from "socket.io-client";

const AppContext = React.createContext({
    event: null,
    user: null
});

function AppContextProvider({ children }) {
    const [event, setEvent] = useState( {
         userCount: 0,
         timetable: [],
    //         {
    //             users: ['James', 'Wilson'],
    //             startDate: new Date('Sun May 02 2021 01:30:00 GMT+1200 (New Zealand Standard Time)'),
    //             endDate: new Date('Sun May 02 2021 02:00:00 GMT+1200 (New Zealand Standard Time)'),
    //         },
    //     ],
     });
    const [user, setUser] = useStateWithCallback({});

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        let currentSocket = socket;
        if (currentSocket != null) {
            return () => currentSocket.disconnect();
        }
    }, [socket]);

    const signIn = async (name, password) => {
        let res = await fetch(`/api/events/${event._id}/sign-in`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, password})
        });

        if (res.status === 400) {
            throw new Error('Name can\'t be empty');
        } else if (res.status === 403) {
            throw new Error('Name and password don\'t matches');
        }

        let body = await res.json()
        setUser({
            name,
            timetable: body.timetable.map(raw => {
                return {
                    id: raw._id,
                    startDate: new Date(raw.startDate),
                    endDate: new Date(raw.endDate)
                };
            })
        });
    }

    useEffect(() => {
        if (user.name === undefined) {
            return;
        }

        const socket = socketIOClient();
        setSocket(socket);
    }, [user.name]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const updateHandler = (userName, newTimetable) => {
            let newGroupTimetables = updateTimetable(event.timetable, userName, newTimetable.map(newTimetable => {
                return {
                    startDate: new Date(newTimetable.startDate),
                    endDate: new Date(newTimetable.endDate)
                }
            }));
            setEvent({ ...event, timetable: newGroupTimetables});
        };
        socket.on('update', updateHandler);
        socket.emit('eventid', event._id);

        return () => socket.off('update', updateHandler);
    }, [socket, event]);

    async function goToEvent(eventId) {
        let res = await fetch(`/api/events/${eventId}`);
        if (res.status === 400 || res.status === 404) {
            throw new Error('No event with that ID exists');
        }
        let body = await res.json();

        setEvent({
            _id: body._id,
            name: body.name,
            dates: body.dates.map(string => new Date(string)),
            from: new Date(body.from),
            to: new Date(body.to),
            timetable: createGroupTimetables(body.users)
        });
    }

    function createGroupTimetables(users) {
        let groupTimetables = [];
        for (let user of users) {
            groupTimetables = updateTimetable(groupTimetables, user.name, user.timetable.map(slot => {
                return {
                    startDate: new Date(slot.startDate),
                    endDate: new Date(slot.endDate),
                }
            }));
        }
        return groupTimetables;
    }

    async function isAuthenticated() {
        let res = await fetch(`/api/events/${event._id}/sign-in`, {
            method: 'POST',
        });

        if (res.status === 400) {
            return false;
        }

        let body = await res.json();

        await new Promise(resolve => {
            setUser({
                name: body.name,
                timetable: body.timetable.map(raw => {
                    return {
                        id: raw._id,
                        startDate: new Date(raw.startDate),
                        endDate: new Date(raw.endDate)
                    };
                })
            }, resolve);
        });

        return true;
    }

    function setTimetable(timetable) {
        socket.emit("tableUpdate", timetable);
        setUser({...user, timetable});
    }
    

    async function createEvent(name, dates, from, to) {
        let res = await fetch(`/api/events/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, dates, from, to})
        });
        if (res.status === 201) {
            console.log("created");
        }
        if (res.status === 400) {
            throw new Error('Error when creating event');
        }

        let body = await res.json();

        setEvent({
            _id: body._id,
            name,
            dates,
            from,
            to,
            timetable: []
        });

        return body._id;
    }

    // The context value that will be supplied to any descendants of this component.
    const context = {
        event,
        user,
        signIn,
        goToEvent,
        isAuthenticated,
        timetable: user ? (user.timetable ? user.timetable : []) : [],
        setTimetable,
        createEvent,
    };

    // Wraps the given child components in a Provider for the above context.
    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    );
}

// Variant: `newTimetables`, `newGroupTimetables` contain no overlap
const updateTimetable = (groupTimetables, userName, newTimetables) => {
    let result = [];

    let newGroupTimetables = [];
    for (let i = 0; i < groupTimetables.length; i++){
        let groupTimetable = {
            users: groupTimetables[i].users.filter(existingUserName => existingUserName !== userName),
            startDate: groupTimetables[i].startDate,
            endDate: groupTimetables[i].endDate,
        }
        if (groupTimetable.users.length !== 0) {
            newGroupTimetables.push(groupTimetable);
        }
    }
    if (newGroupTimetables.length !== 0) {
        // If slot next to each other, merge them 
        newGroupTimetables.sort((slot1, slot2) => slot2.startDate.getTime() - slot1.startDate.getTime());
        // console.log(newGroupTimetables);
        let mergedNewGroupTimetables = [];
        let currentSlot = newGroupTimetables[0];
        for (var i = 1; i < newGroupTimetables.length; i++) {
            // if next to then we update current slot
            if (currentSlot.endDate.getTime() === newGroupTimetables[i].startDate.getTime() && JSON.stringify(currentSlot.users) === JSON.stringify(newGroupTimetables[i].users)) {
                currentSlot.endDate = newGroupTimetables[i].endDate;
                continue;
            }
            mergedNewGroupTimetables.push(currentSlot);
            currentSlot = newGroupTimetables[i];
            // if not then put current into merged. put [i] into current
        }
        mergedNewGroupTimetables.push(currentSlot);
        newGroupTimetables = mergedNewGroupTimetables;
    }
    
    
    // Find a match for one newTimetable each loop. If there is no match then create new group slot
    while (newTimetables.length !== 0) {
        let newTimetable = newTimetables.pop();

        let processedNewGroupTimetables = [];

        let isMatch = false;
        // Process a groupTimetable slot each loop.
        // It might get broken into smaller slot and put back into `newGroupTimetables`
        while (newGroupTimetables.length !== 0 && !isMatch) {
            let groupTimetable = newGroupTimetables.pop();

            let newTimetableSections = split(newTimetable, groupTimetable.startDate, groupTimetable.endDate);
            let groupTimetableSections = split(groupTimetable, newTimetable.startDate, newTimetable.endDate);

            // The sections from 2 groups that is matched will be merged, and put into processedNewGroupTimetables
            for (let i = 0; i < newTimetableSections.length && !isMatch; i++) {
                let newTimetableSection = newTimetableSections[i];

                for (let j = 0; j < groupTimetableSections.length; j++) {
                    let groupTimetableSection = groupTimetableSections[j];

                    if (newTimetableSection.startDate.getTime() === groupTimetableSection.startDate.getTime() &&
                        newTimetableSection.endDate.getTime() === groupTimetableSection.endDate.getTime()) {

                        // Remove the match from the sections
                        newTimetableSections.splice(i, 1);
                        groupTimetableSections.splice(j, 1);

                        groupTimetableSection.users.push(userName);
                        // There is no need for `groupTimetableSection` to be put back into `processedNewGroupTimetables`
                        // Since it will not be match again
                        result.push(groupTimetableSection);

                        // leftover from newTimetableSections will be put back into newTimetables
                        newTimetables.push(...newTimetableSections);
                        // leftover from groupTimetableSections will be put back into newGroupTimetables
                        newGroupTimetables.push(...groupTimetableSections);

                        isMatch = true;
                        break;
                    }
                }
            }

            if (isMatch) {
                break;
            } else {
                processedNewGroupTimetables.push(groupTimetable);
            }
        }

        if (!isMatch) {
            newGroupTimetables.push({
                users: [userName],
                startDate: newTimetable.startDate,
                endDate: newTimetable.endDate
            })
        }

        // `newGroupTimetables` probably still contains something, if we stop because of a match
        newGroupTimetables.push(...processedNewGroupTimetables);
    }

    result.push(...newGroupTimetables);
    return result;
}

// Made sure the return slots aren't connected to each other
// (like the array users of each slot are a separate object)
function split(timeSlot, ...splitDates) {
    // Make sure splitDates is sorted from old to new
    splitDates.sort((date1, date2) => date1.getTime() - date2.getTime())
    let users = timeSlot.users;
    let result = [{
        users: users && [...users],
        startDate: new Date(timeSlot.startDate),
        endDate: new Date(timeSlot.endDate),
    }];

    for (let splitDate of splitDates) {
        if (splitDate.getTime() > result[result.length - 1].startDate.getTime() &&
            splitDate.getTime() < result[result.length - 1].endDate.getTime()) {
            let secondHalfEndDate = result[result.length - 1].endDate;
            let firstHalf = result.pop();
            firstHalf.endDate = splitDate;
            result.push(firstHalf);

            result.push({
                users: users && [...users],
                startDate: new Date(splitDate),
                endDate: secondHalfEndDate
            })
        }
    }

    return result;
}

export {
    AppContext,
    AppContextProvider,
    split,
};
