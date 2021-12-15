import React from 'react';
import ReactDOM from 'react-dom';
import './reset.css';
import './index.css';
import UserProvider from './store/UserProvider';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
