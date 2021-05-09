import {useHistory, useParams} from 'react-router-dom';
import {useContext, useEffect} from 'react';
import {AppContext} from '../AppContextProvider';

const EventLoading = ({children}) => {
    const history = useHistory();
    const { eventId: eventIdParam } = useParams();
    const { event, goToEvent } = useContext(AppContext);

    // Load the event information
    useEffect(() => {
        if (eventIdParam !== event._id) {
            goToEvent(eventIdParam).catch(e => {
                window.alert(e.message);
                history.replace('/');
            });
        }
        // eslint-disable-next-line
    }, []);

    return eventIdParam !== event._id ? <p>Loading</p> : children;
};

export default EventLoading;
