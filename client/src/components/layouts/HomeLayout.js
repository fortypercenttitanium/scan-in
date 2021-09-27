import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import SessionLayout from './SessionLayout';

function LinkTab(props) {
  return <Tab sx={{ mx: 4 }} component={Link} {...props} />;
}

export default function HomeLayout() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Router>
      <Box
        sx={{
          width: '100%',
          m: 'auto',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
          sx={{ mt: 10 }}
          centered
        >
          <LinkTab label="My Classes" to="/" />
          <LinkTab label="Past attendances" to="/sessions" />
          <LinkTab label="Help" to="/help" />
        </Tabs>
        <Paper sx={{ mx: 'auto', p: 3, maxWidth: 'md' }} elevation={3}>
          <Switch>
            <Route exact path="/">
              <Paper elevation={2}>Classes</Paper>
            </Route>
            <Route path="/sessions">
              <Paper elevation={2}>Sessions</Paper>
            </Route>
            <Route path="/help">
              <Paper elevation={2}>Help</Paper>
            </Route>
          </Switch>
        </Paper>
      </Box>
    </Router>
  );
}
