import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
} from 'react-router-dom';
import './App.css';
import { Box, Paper, CssBaseline, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import Header from './components/Header/Header';
import HomeLayout from './components/layouts/HomeLayout';
import SessionLayout from './components/layouts/SessionLayout';
import ClosedSessionLayout from './components/layouts/ClosedSessionLayout';
import SocketProvider from './store/SocketProvider';
import Footer from './components/Footer/Footer';
import AuthRedirect from './customHooks/AuthRedirect';
import { UserStore } from './store/UserProvider';

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
  const { userData } = useContext(UserStore);

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          bgcolor: grey[100],
          width: '100%',
          minWidth: '1000px',
          minHeight: '768px',
        }}
      >
        <Header />
        <Box
          sx={{
            display: 'flex',
            width: '100%',
          }}
        >
          <Router>
            <Switch>
              <Route exact path="/">
                {userData && !userData.loading ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <WelcomeScreen />
                )}
              </Route>
              <AuthRedirect>
                <Route path="/dashboard">
                  <HomeLayout />
                </Route>
                <Route path="/session/:id">
                  <SocketProvider>
                    <SessionLayout />
                  </SocketProvider>
                </Route>
                <Route path="/sessionrecap/:id">
                  <ClosedSessionLayout />
                </Route>
              </AuthRedirect>
            </Switch>
          </Router>
        </Box>
        <Footer />
      </Box>
    </>
  );
}

export default App;
