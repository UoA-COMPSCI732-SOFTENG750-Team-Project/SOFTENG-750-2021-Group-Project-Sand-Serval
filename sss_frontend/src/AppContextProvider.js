import React, {useEffect, useState} from 'react';
import socketIOClient from "socket.io-client";

const AppContext = React.createContext({
    event: null,
    user: null
});

function AppContextProvider({ children }) {

    
    // TODO: change event to null
    // eslint-disable-next-line
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
    const [user, setUser] = useState(null);

    
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
   

    //Update timetable. Send through to backend by socket
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
    }

    async function updateTimetable(userName, newTimetable) {
        //setEvent({...event, timetable});
        //console.log(event.timetable);
        //console.log(timetable);
    }

    // The context value that will be supplied to any descendants of this component.
    const context = {
        event,
        user,
        signIn,
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
