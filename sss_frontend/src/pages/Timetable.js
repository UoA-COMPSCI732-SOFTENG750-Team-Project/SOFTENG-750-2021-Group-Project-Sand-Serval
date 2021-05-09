import {useContext, useEffect, useState} from 'react';
import Switch from 'react-switch';
import {useHistory, useParams} from 'react-router-dom';
import {Typography} from '@material-ui/core';
import UserTimetable from '../components/UserTimetable';
import styles from './Timetable.module.css';
import GroupTimetable from '../components/GroupTimetable';
import {AppContext} from '../AppContextProvider';

const MODE = {
    USER: 'USER',
    GROUP: 'GROUP',
};

export default function Timetable() {
    const history = useHistory();
    const { eventId: eventIdParam } = useParams();
    const { event, isAuthenticated } = useContext(AppContext);
    const [viewOnly, setViewOnly] = useState(true);
    const [mode, setMode] = useState(MODE.USER);

    useEffect(() => {
        isAuthenticated().then(isAuthenticated => {
            if (!isAuthenticated) {
                history.replace(`/${eventIdParam}/signIn`);
            } else {
                setViewOnly(false);
            }
        });
    }, []);

    if (viewOnly) {
        return <p>Loading</p>;
    }

    return (
        <>
            <Switch
                checked={mode === MODE.GROUP}
                onChange={checked => setMode(checked ? MODE.GROUP : MODE.USER)}
                checkedIcon={<p className={styles.switchComponent}>My</p>}
                checkedHandleIcon={<p className={styles.switchComponent}>Group</p>}
                uncheckedIcon={<p className={styles.switchComponent}>Group</p>}
                uncheckedHandleIcon={<p className={styles.switchComponent}>My</p>}
                handleDiameter={50}
                height={58}
                width={120}
                borderRadius={20}
                onColor={'#5CFC6C'}
                onHandleColor={'#C4C4C4'}
                offColor={'#C4C4C4'}
                offHandleColor={'#5CFC6C'}
            />
            <Typography variant="h3" align={'center'}>Event: {event.name}</Typography>
            {mode === MODE.USER ? <UserTimetable/> : <GroupTimetable/>}
        </>
    );
};
