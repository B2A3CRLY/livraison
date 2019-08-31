import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import './index.css';
import App from './App';
Sentry.init({dsn: "https://27fde26ba62f44579e40f08b6b92c597@sentry.io/1545603"});
ReactDOM.render(<App />, document.getElementById('root'));

