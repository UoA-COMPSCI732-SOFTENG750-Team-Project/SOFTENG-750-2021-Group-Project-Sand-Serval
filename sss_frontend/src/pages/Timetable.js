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
const appendLeadingZeroes = (n) =>{
    if(n <= 9){
      return "0" + n;
    }
    return n
};

const bestTime = (e) => {
    if (e.length === 0) {
        return "None"
    } else {
        try {
        let i;
        let userNum = 0;
        let userIndex = 0;
        for (i=0; i<e.length; i++) {
            if (e[i].users.length > userNum) {
                userNum = e[i].users.length;
                userIndex = i;
            }
        }
        const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let eventUser = e[userIndex].users.join(', ');
        let start = e[userIndex].startDate;
        let end = e[userIndex].endDate;
        let starttime = appendLeadingZeroes(start.getDate()) + '-' + months[start.getMonth()] + " " + appendLeadingZeroes(start.getHours()) + ':' + appendLeadingZeroes(start.getMinutes());
        let endtime = appendLeadingZeroes(end.getDate()) + '-' + months[end.getMonth()] + " " + appendLeadingZeroes(end.getHours()) + ':' + appendLeadingZeroes(end.getMinutes());
        return starttime + " to " + endtime + " | " + eventUser + " is/are avaliable";
        }
        catch (error) {
            return 'None'
        }
    }
}
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
        // eslint-disable-next-line
    }, []);

    if (viewOnly) {
        return <p>Loading</p>;
    }
    let url = window.location.href;
    url = url.substring(0, url.length-9) + "sign-in";
    let besttime = bestTime(event.timetable).toString();
    // console.log(besttime);

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
            <Typography>{url}</Typography>

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
            <Typography variant="h6" align={'center'}>The best time would be: <br/> </Typography>
            <Typography variant="h6" align={'center'} color="secondary"className={styles.bestTime}>{besttime} </Typography>

            {mode === MODE.USER ? <UserTimetable/> : <GroupTimetable/>}
        </>
    );
};
