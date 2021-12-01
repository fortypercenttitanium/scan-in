import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import ClassList from '../ClassList/ClassList';
import SessionList from '../SessionRecap/SessionList';
import Help from '../Help/Help';

function LinkTab(props) {
  return <Tab sx={{ mx: 4 }} component={Link} {...props} />;
}

export default function HomeLayout() {
  const [value, setValue] = React.useState(0);
  const history = useHistory();
  const { path, url } = useRouteMatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function handleStartSession(id) {
    history.push(`/session/${id}`);
  }

  function handleSessionRecap(id) {
    history.push(`/sessionrecap/${id}`);
  }

  return (
    <Router>
      <Box
        sx={{
          width: '100%',
          m: 'auto auto 90px',
          overflow: 'visible',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
          sx={{ mt: 3 }}
          centered
        >
          <LinkTab label="My Classes" to={url} />
          <LinkTab label="Past attendances" to={`${url}/sessions`} />
          <LinkTab label="Help" to={`${url}/help`} />
        </Tabs>
        <Paper
          sx={{
            m: 'auto',
            p: 3,
            maxWidth: 'md',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
          elevation={3}
        >
          <Switch>
            <Route exact path={path}>
              <ClassList onSubmit={handleStartSession} />
            </Route>
            <Route path={`${path}/sessions`}>
              <SessionList onSessionClick={handleSessionRecap} />
            </Route>
            <Route path={`${path}/help`}>
              <Help />
            </Route>
          </Switch>
        </Paper>
      </Box>
    </Router>
  );
}
