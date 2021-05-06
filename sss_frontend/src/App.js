// import { Switch, Route, Redirect, Link, useLocation } from 'react-router-dom';
import { AppBar, Typography, CssBaseline, Button, Toolbar } from '@material-ui/core';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home'
// import { useContext } from 'react';
// import Footer from './components/Footer';
// import dayjs from 'dayjs';
import './App.css';
import { Container } from '@material-ui/core';
import SignIn from './pages/SignIn';

function App() {

  
  return (
    <div className="Root">
      <CssBaseline />
      <AppBar position="fixed" id="NavBar">
        <Toolbar>
          <Typography variant="h6" id="title">
            SSScheduler
          </Typography>
          <Button variant="contained" color="primary">
            Plan an Event
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" id="main">
        <BrowserRouter>
          <Switch>
            <Route path="/sign-in">
              <SignIn />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </BrowserRouter>
      </Container>
      
    </div>
  );
}

export default App;
