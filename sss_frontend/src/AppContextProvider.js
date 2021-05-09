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
         timetable: [
             {
                 users: [null],
                 startDate: null,
                 endDate: null,
             }
            ],
    //         {
    //             users: ['James', 'Wilson'],
    //             startDate: new Date('Sun May 02 2021 01:30:00 GMT+1200 (New Zealand Standard Time)'),
    //             endDate: new Date('Sun May 02 2021 02:00:00 GMT+1200 (New Zealand Standard Time)'),
    //         },
    //     ],
     });
    const [user, setUser] = useStateWithCallback(null);

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        let currentSocket = socket;
        if (currentSocket != null) {
            return () => currentSocket.disconnect();
        }
    }, [socket]);

    async function signIn(name, password) {
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

        setUser({name});

        const socket = socketIOClient();
        socket.on("update", (userName, newTimetable) => {
            updateTimetable(userName, newTimetable);
        });
        setSocket(socket);
        socket.emit("eventid", event._id);
    }
   

    async function goToEvent(eventId) {
        let res = await fetch(`/api/events/${eventId}`);
        if (res.status === 400 || res.status === 404) {
            throw new Error('No event with that ID exists');
        }
        let body = await res.json();

        setEvent({
            // TODO: probably remove the next line when removing the hardcoded data at `const [event, setEvent]`
            ...event,
            _id: body._id,
            name: body.name,
            dates: body.dates.map(string => new Date(string)),
            from: new Date(body.from),
            to: new Date(body.to)
        });
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
                name: body.name
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
            ...event,
            _id: body._id,
            name,
            dates,
            from,
            to
        });

        return body._id;
    }

    async function updateTimetable(userName, newTimetables) {
        let newGroupTimetables = [];
        for (var i = 0; i < event.timetable.length; i++){
            let groupTimetable = {
                users: event.timetable[i].users.filter(existingUserName => existingUserName !== userName),
                startDate: event.timetable[i].startDate,
                endDate: event.timetable[i].endDate,
            }
            if (groupTimetable.users.length !== 0) {
                newGroupTimetables.push(groupTimetable);
            }
        }

        while (newTimetables.length !== 0) {
            let newTimetable = newTimetables.pop();

            newGroupTimetables.forEach(groupTimetable => {
                if (newTimetable.endDate.getTime() < groupTimetable.startDate.getTime()) {
                    // skip
                } else if (newTimetable.startDate.getTime() < groupTimetable.startDate.getTime() &&
                    newTimetable.endDate.getTime() < groupTimetable.endDate.getTime()) {
                        //Split at group startDate
                        //Goes until newTimetable endDate
                } else if (newTimetable.startDate.getTime() > groupTimetable.startDate.getTime() &&
                    newTimetable.endDate.getTime() < groupTimetable.endDate.getTime()) {

                } else if (newTimetable.startDate.getTime() > groupTimetable.startDate.getTime() &&
                    newTimetable.endDate.getTime() > groupTimetable.endDate.getTime()) {

                } else if (newTimetable.startDate.getTime() > groupTimetable.endDate.getTime()) {
                    // skip
                }
            });
        }
        newTimetables.forEach(newTimetable => {
            let newNewGroupTimetables = [];
            //CheckEveryGroupForUniqueTimeSlot checks if current timeslot endDate before all group startDate

            newGroupTimetables.forEach(groupTimetable => {
                if (newTimetable.endDate.getTime() < groupTimetable.startDate.getTime()) {
                    newNewGroupTimetables.push({
                        users: [userName],
                        startDate: 
                    });
                }
            });
        });
        
        setEvent({...event, timetable: newTimetables})
        //setEvent({...event, timetable});
        //console.log(event.timetable);
        //console.log(timetable);
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

export {
    AppContext,
    AppContextProvider
};
