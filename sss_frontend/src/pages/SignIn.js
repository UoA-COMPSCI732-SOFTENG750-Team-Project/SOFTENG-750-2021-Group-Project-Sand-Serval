import { Button, Divider, InputLabel, TextField, Typography } from "@material-ui/core";
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './SignIn.module.css';
import { AppContext } from '../AppContextProvider';

export default function SignIn() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    const { event, signIn } = useContext(AppContext);

    const extendedSignIn = () => {
        if (!name) {
            window.alert('Missing name');
            return;
        }

        signIn(name, password)
            .then(() => history.push(`/${event._id}/timetable`))
            .catch(e => window.alert(e.message));
    };

    const keyPress = (e) => {
        if (e.keyCode === 13) {
            extendedSignIn();
        }
    }
    return (
        <section className={styles.signInContainer}>
            <Typography variant="h5">Enter your name to see "{event.name}"</Typography>
            <Divider />

            <section className={styles.signInSection}>
                <InputLabel htmlFor="name"><Typography variant="h6">Name:</Typography></InputLabel>
                <TextField
                    value={name}
                    onKeyDown={keyPress}
                    onChange={event => setName(event.target.value)}
                    id="name"
                    label="Enter Your Name:" 
                    required 
                    inputProps={{min: 0, style: { textAlign: 'center'}}}
                    autoFocus
                />
            </section>

            <section className={styles.signInSection}>
                <InputLabel htmlFor="password"><Typography variant="h6">Password:</Typography></InputLabel>
                <TextField
                    value={password}
                    onKeyDown={keyPress}
                    onChange={event => setPassword(event.target.value)}
                    id="password"
                    label="Optional" 
                    inputProps={{min: 0, style: { textAlign: 'center'}}} 
                     />
            </section>

            <section className={styles.signInSection}>
                <Button variant="contained" color="primary"  onClick={extendedSignIn} style={{backgroundColor: "#4E9BFF", color: '#FFFFFF', marginTop: '20px'}}>
                    Sign In
                </Button>
            </section>
        </section>
    );
}
