import React, {useState} from 'react';

const AppContext = React.createContext({
    event: null,
    user: null
});

function AppContextProvider({ children }) {
    // TODO: change event to null
    // eslint-disable-next-line
    const [event, setEvent] = useState({
        _id: '608ba57e2b763e2b407e6dbf',
        userCount: 2,
        timetable: [
            {
                users: ['James'],
                startDate: new Date('Sun May 02 2021 00:30:00 GMT+1200 (New Zealand Standard Time)'),
                endDate: new Date('Sun May 02 2021 01:00:00 GMT+1200 (New Zealand Standard Time)'),
            },
            {
                users: ['James', 'Wilson'],
                startDate: new Date('Sun May 02 2021 01:30:00 GMT+1200 (New Zealand Standard Time)'),
                endDate: new Date('Sun May 02 2021 02:00:00 GMT+1200 (New Zealand Standard Time)'),
            },
        ],
    });
    const [user, setUser] = useState(null);

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
    }

    function setTimetable(timetable) {
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

        setEvent({
            ...event,
            name,
            dates,
            from,
            to
        });
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
