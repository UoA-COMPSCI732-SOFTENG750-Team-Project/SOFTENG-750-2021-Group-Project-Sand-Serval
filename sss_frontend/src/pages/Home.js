import { Typography, Button, TextField, Container } from "@material-ui/core";
import { Link } from "react-router-dom";
import CalendarPicker from '../components/calendar'
import styles from './Home.module.css';
import React, { useContext, useState} from 'react';

// eslint-disable-next-line
import SelectStartTime from '../components/selectStartTime'
import SelectEndTime from '../components/selectEndTime'
import { AppContext } from '../AppContextProvider';

export default function Home() {
    const [name, setName] = useState('');

    const [dates, setDate] = useState([
        {
          startDate: new Date(),
          endDate: null,
          key: 'selection'
        }
      ]);
    const [from, setFrom] = useState(new Date("2018-01-01T00:00:00.000Z"));
    const [to, setTo] = useState(new Date("2018-01-01T00:00:00.000Z"));

    const { createEvent } = useContext(AppContext);

    const extendCreateEvent = () => { 
        if (!name) {
            window.alert('Missing name');
            return;
        }
        createEvent(name
        , dates, from, to).catch(e => window.alert(e.message))

    }
    return (
        <Container className={styles.Container}>
            <TextField placeholder="Enter Your Event Name" onChange={(event) => {setName(event.target.value); console.log(event.target.value)}} >
                
            </TextField>
            
            
            {/* <Wrapper/> */}
            <div className={styles.midSection}>
                <div>
                    <Typography variant="h5" color='inherit'> 
                        Choose Dates
                    </Typography>
                    <CalendarPicker date={dates} onChange={item => setDate([item.selection])}/>
                </div>
                <div >
                    <Typography variant="h5" color='inherit'> 
                        Choose Time
                    </Typography>
                    <div className="pickTime">
                        <SelectStartTime />

                        <SelectEndTime />
                    </div>
                </div>
            </div>

            <Link to={"/sign-in"}>
                <Button variant="contained" 
                        style={{backgroundColor: '#4E9BFF', color: '#FFFFFF'}}
                        onClick={() => extendCreateEvent() }>
                    Create Event!
                </Button>
            </Link>
        </Container>
    )
}