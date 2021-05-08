import {useState} from 'react';
import Switch from 'react-switch';
import UserTimetable from '../components/UserTimetable';
import styles from './Timetable.module.css';
import GroupTimetable from '../components/GroupTimetable';

const MODE = {
    USER: 'USER',
    GROUP: 'GROUP',
};

export default function Timetable() {
    const [mode, setMode] = useState(MODE.USER);
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
            {mode === MODE.USER ? <UserTimetable/> : <GroupTimetable/>}
        </>
    );
};
