import React, {useState} from 'react';
import useStateWithCallback from './hooks/useStateWithCallback';

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
    const [user, setUser] = useStateWithCallback(null);

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
