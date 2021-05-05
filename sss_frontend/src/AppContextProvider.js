import React, {useState} from 'react';

const AppContext = React.createContext({
    event: null,
    user: null
});

function AppContextProvider({ children }) {
    // TODO: change event to null
    // eslint-disable-next-line
    const [event, setEvent] = useState({_id: '608ba57e2b763e2b407e6dbf'});
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

        setUser(name);
    }

    // The context value that will be supplied to any descendants of this component.
    const context = {
        event,
        user,
        signIn,
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
