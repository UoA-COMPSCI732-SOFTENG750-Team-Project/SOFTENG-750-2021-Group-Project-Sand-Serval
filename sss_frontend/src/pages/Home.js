import { Typography, Button, TextField, Container } from "@material-ui/core";
import { Link } from "react-router-dom";
import CalendarPicker from '../components/calendar'
import styles from './Home.module.css';
// eslint-disable-next-line
import Wrapper from './Timetable.js';
import SelectStartTime from '../components/selectStartTime'
import SelectEndTime from '../components/selectEndTime'

export default function Home() {
    return (
        <Container className={styles.Container}>
            <TextField placeholder="Enter Your Event Name">
                
            </TextField>
            
            
            {/* <Wrapper/> */}
            <div className={styles.midSection}>
                <div>
                    <Typography variant="h5" color='inherit'> 
                        Choose Dates
                    </Typography>
                    <CalendarPicker />
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
                <Button variant="contained" style={{backgroundColor: '#4E9BFF', color: '#FFFFFF'}}>
                    Create Event!
                </Button>
            </Link>
        </Container>
    )
}