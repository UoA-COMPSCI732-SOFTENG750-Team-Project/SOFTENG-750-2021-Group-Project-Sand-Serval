import { AppBar, Typography, Container, CssBaseline, Button, Toolbar, makeStyles } from '@material-ui/core';
import {Switch, Redirect, Route, BrowserRouter} from 'react-router-dom';
import Home from './pages/Home';
import Timetable from './pages/Timetable';
import './App.css';
import SignIn from './pages/SignIn';
import moment from 'moment';
import EventLoading from './pages/EventLoading';

const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    main: {
        marginTop: theme.spacing(10)
    }
}));

function App() {
    const classes = useStyles();
    const eventIdPath = "/:eventId([\\da-f]+)";

    return (
        <div className="Root">
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar} id="NavBar">
                <Toolbar>
                    <Typography variant="h6" id="title">
                        SSScheduler
                    </Typography>
                    <Button variant="contained" style={{backgroundColor: '#4E9BFF', color: '#FFFFFF'}}>
                        Plan an Event
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" className={classes.main}>
                <BrowserRouter>
                    <Switch>
                        <Route path={eventIdPath + "/sign-in"}>
                            <EventLoading>
                                <SignIn />
                            </EventLoading>
                        </Route>
                        <Route path={eventIdPath + "/timetable"}>
                            <EventLoading>
                                <Timetable />
                            </EventLoading>
                        </Route>
                        <Route
                            path={eventIdPath}
                            render={props => {
                                return <Redirect to={`/${props.match.params.eventId}/sign-in`} />
                            }}
                        />
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                </BrowserRouter>
            </Container>
            <footer>
                <p>&copy; SE750 / CS732, Group 30 - Sand Serval, {moment().format("MMMM Do, YYYY")}</p>
            </footer>
        </div>
    );
}

export default App;
