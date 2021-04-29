import { Button, Divider, InputLabel, TextField, Typography } from "@material-ui/core";
import { useState } from 'react';
import styles from "./SignIn.module.css";

export default function SignIn() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    return (
        <section className={styles.signInContainer}>
            <Typography variant="h5">Enter your name to see "Event"</Typography>
            <Divider />

            <section className={styles.spacing + " " + styles.inputGroup}>
                <InputLabel htmlFor="name"><Typography variant="h6">Name:</Typography></InputLabel>
                <TextField
                    value={name}
                    onChange={event => setName(event.target.value)}
                    id="name"
                    variant="outlined"
                />
            </section>

            <section className={styles.spacing + " " + styles.inputGroup}>
                <InputLabel htmlFor="password"><Typography variant="h6">Password:</Typography></InputLabel>
                <TextField
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    id="password"
                    placeholder="Optional"
                    variant="outlined" />
            </section>

            <Button variant="contained" color="primary" className={styles.spacing}>
                Sign In
            </Button>
        </section>
    );
}
