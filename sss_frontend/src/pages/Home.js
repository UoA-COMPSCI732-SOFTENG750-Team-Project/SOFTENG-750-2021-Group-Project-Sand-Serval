import { Typography, Button, TextField, Container } from "@material-ui/core";
import { Link } from "react-router-dom";
import CalendarPicker from '../components/calendar'
import styles from './Home.module.css';

export default function Home() {
    return (
        <Container className={styles.Container}>
            <TextField placeholder="Enter Your Event Name">
                
            </TextField>
            
            <Typography>
                    Choose Date
                </Typography>
            <CalendarPicker />
            <Link to={"/sign-in"}>
                <Button variant="contained" color="primary">
                    Create Event!
                </Button>
            </Link>
        </Container>
    )
}