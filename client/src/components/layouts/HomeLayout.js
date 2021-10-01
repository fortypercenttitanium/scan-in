import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Fullscreen from '@mui/icons-material/Fullscreen';
import FullscreenExit from '@mui/icons-material/FullscreenExit';
import ClassList from '../ClassList';
import Scanner from '../Scanner';
import Numpad from '../Numpad';

function LinkTab(props) {
  return <Tab sx={{ mx: 4 }} component={Link} {...props} />;
}

export default function HomeLayout() {
  const [value, setValue] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleFullscreen = () => {
    const element = document.querySelector('.fullscreen');
    if (document.fullscreenElement) {
      return document.exitFullscreen();
    }
    return element.requestFullscreen();
  };

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
          <LinkTab label="My Classes" to="/" />
          <LinkTab label="Past attendances" to="/sessions" />
          <LinkTab label="Help" to="/help" />
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
          className="fullscreen"
        >
          <IconButton
            sx={{ position: 'absolute', top: '24px', right: '24px' }}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
          <Switch>
            <Route exact path="/">
              <ClassList
                onSubmit={() => console.log('starting session! (not really)')}
              />
            </Route>
            <Route path="/sessions">
              <Numpad />
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
