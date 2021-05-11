import { Typography, Button, TextField, Container } from "@material-ui/core";
import { useHistory  } from "react-router-dom";
import styles from './Home.module.css';
import React, { useContext, useState } from 'react';
import MuiAlert from "@material-ui/lab/Alert";
// eslint-disable-next-line
import SelectStartTime from '../components/selectStartTime'
import SelectEndTime from '../components/selectEndTime'
import { AppContext } from '../AppContextProvider';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { DateRange } from 'react-date-range';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }


export default function Home(props) {
    const [name, setName] = useState('');

    const [dates, setDates] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
      ]);

    const [from, simpleSetFrom] = useState(new Date("May 1, 2021 09:00:00"));
    const [to, simpleSetTo] = useState(new Date("May 1, 2021 22:00:00"));
    const setFrom = newFrom => {
        if (newFrom.getHours() >= to.getHours()) {
            let newTo = new Date(newFrom);
            newTo.setHours(newFrom.getHours() + 1);
            simpleSetTo(newTo);
        }
        simpleSetFrom(newFrom);
    };
    const setTo = newTo => {
        if (newTo.getHours() <= from.getHours()) {
            let newFrom = new Date(newTo);
            newFrom.setHours(newTo.getHours() - 1);
            simpleSetFrom(newFrom);
        }
        simpleSetTo(newTo);
    };

    const [error, setError] = useState("");

    const { createEvent } = useContext(AppContext);

    const history = useHistory();

    const extendCreateEvent = () => { 
        if (!name) {
            setError("Please Enter Event Name");
            return;
        }
        createEvent(name, [dates[0].startDate, dates[0].endDate], from, to)
            .then(eventId => {
                history.push(`/${eventId}/sign-in`);
            })
            .catch(e => window.alert(e))
    }

    const executeScroll = () => window.scrollTo(0, 0);
    
    const keyPress = (e) => {
        if (e.keyCode === 13) {
            extendCreateEvent() ; executeScroll();
        }
    }

    return (
        <Container className={styles.Container} >
            <div>
                {error && (
                    <Alert severity="error" onClick={() => setError(null)}>
                    {props.error || error}
                    </Alert>
                )}
            </div>
            <TextField 
                       defaultValue=""
                       required 
                       label="Enter Event Name:" 
                       onKeyDown={keyPress}
                       onChange={(event) => {
                           setName(event.target.value); 
                           setError(null)
                        }}
                        inputProps={{min: 0, style: { textAlign: 'center'}}} 
                        >
                        
            </TextField>
            
            
            <div className={styles.midSection}>
                <div className={styles.dates} >
                    <Typography 
                        variant="h5" 
                        color='inherit'
                        className={styles.chooseDate}
                    >
                        Choose Dates
                    </Typography>
                    <DateRange
                        editableDateInputs={true}
                        onChange={item => setDates([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={dates}
                        className={styles.dateRange}
                        style={{width: '100%'}}
                        />
                </div>
                <div >
                    <Typography 
                        variant="h5" 
                        color='inherit'
                        className={styles.chooseTime}
                        > 
                        Choose Time
                    </Typography>
                    <div className={styles.pickTime}>
                        
                        <SelectStartTime from={from} setFrom={setFrom} />
                        <SelectEndTime to={to} setTo={setTo}/>
                    </div>
                </div>
            </div>
                
            <Button variant="contained" 
                    disabled={!!error}
                    style={{backgroundColor: !!error ? '#6c6c6c': "#4E9BFF", color: '#FFFFFF', marginTop: '20px'}}
                    onClick={() => {extendCreateEvent() ; executeScroll()} }>
                Create Event!
            </Button> 
            

        </Container>

        
    )
}
