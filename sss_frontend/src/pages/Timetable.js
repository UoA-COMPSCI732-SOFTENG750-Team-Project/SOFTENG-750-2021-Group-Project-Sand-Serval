import {useContext, useEffect, useState} from 'react';
import Switch from 'react-switch';
import {useHistory, useParams} from 'react-router-dom';
import {Typography, Divider, Button} from '@material-ui/core';
import UserTimetable from '../components/UserTimetable';
import styles from './Timetable.module.css';
import GroupTimetable from '../components/GroupTimetable';
import {AppContext} from '../AppContextProvider';
import { CopyToClipboard } from 'react-copy-to-clipboard'

const MODE = {
    USER: 'USER',
    GROUP: 'GROUP',
};

export default function Timetable() {
    const history = useHistory();
    const { eventId: eventIdParam } = useParams();
    const { user, event, isAuthenticated } = useContext(AppContext);
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
    let url = window.location.href;
    url = url.substring(0, url.length-9) + "sign-in";
    return (
        <>
        <div className={styles.topButton}>
            <CopyToClipboard text={url}>
                <Button variant="contained"  
                        style={{height: "100%", backgroundColor: '#4E9BFF', color: '#FFFFFF'}}
                        >
                    Copy the link
                </Button>
            </CopyToClipboard>
            <Switch
                checked={mode === MODE.GROUP}
                onChange={checked => setMode(checked ? MODE.GROUP : MODE.USER)}
                checkedIcon={<p className={styles.switchComponent}>My</p>}
                checkedHandleIcon={<p className={styles.switchComponent}>Group</p>}
                uncheckedIcon={<p className={styles.switchComponent}>Group</p>}
                uncheckedHandleIcon={<p className={styles.switchComponent}>My</p>}
                handleDiameter={40}
                height={40}
                width={110}
                borderRadius={15}
                onColor={'#5CFC6C'}
                onHandleColor={'#C4C4C4'}
                offColor={'#C4C4C4'}
                offHandleColor={'#5CFC6C'}
            />
            
        </div>
            <Typography variant="h3" align={'center'} className={styles.greeting}>Welcome to the event [{event.name}], {user.name} </Typography>
            <Divider />

            {mode === MODE.USER ? <UserTimetable/> : <GroupTimetable/>}
        </>
    );
};
