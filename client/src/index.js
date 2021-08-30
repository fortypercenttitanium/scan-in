import React from 'react';
import ReactDOM from 'react-dom';
import './reset.css';
import './index.css';
import Provider from './store/Provider';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
