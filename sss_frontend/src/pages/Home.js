import { Typography, Button, TextField, Container } from "@material-ui/core";
import { Link } from "react-router-dom";
import CalendarPicker from '../components/calendar'
import styles from './Home.module.css';
// eslint-disable-next-line
import Wrapper from './Timetable.js';

export default function Home() {
    return (
        <Container className={styles.Container}>
            <TextField placeholder="Enter Your Event Name">
                
            </TextField>
            
            <Typography variant="h5" color='inherit'> 
                Choose Dates
            </Typography>
            {/* <Wrapper/> */}
            <div className={styles.midSection}>
                <CalendarPicker />
                
            </div>

            <Link to={"/sign-in"}>
                <Button variant="contained" color="primary">
                    Create Event!
                </Button>
            </Link>
        </Container>
    )
}