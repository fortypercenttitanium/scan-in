import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import './App.css';
import { Box, Paper, CssBaseline, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import Header from './components/Header';
import HomeLayout from './components/layouts/HomeLayout';
import SessionLayout from './components/layouts/SessionLayout';
import SocketProvider from './store/SocketProvider';
import Footer from './components/Footer';
import { Store } from './store/Provider';

function WelcomeScreen() {
  return (
    <Paper sx={{ mx: 'auto', my: 6, p: 8, textAlign: 'center' }}>
      <Typography variant="h4" elevation={3}>
        Welcome, please log in to get started!
      </Typography>
    </Paper>
  );
}

function App() {
  const { userData } = useContext(Store);

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          bgcolor: grey[100],
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <Header />
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Router>
            <Switch>
              <Route exact path="/">
                {userData ? <Redirect to="/dashboard" /> : <WelcomeScreen />}
              </Route>
              <Route path="/dashboard">
                <HomeLayout />
                <Link to="/session/123">Test</Link>
              </Route>
              <Route path="/session/:id">
                <SocketProvider>
                  <SessionLayout />
                </SocketProvider>
              </Route>
            </Switch>
          </Router>
        </Box>
        <Footer />
      </Box>
    </>
  );
}

export default App;
