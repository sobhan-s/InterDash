import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';



window.onerror = (msg, src, line, col, err) => {
  console.error('Global Error:', msg, err);
};

const _originalError = console.error;
console.error = (...args: any[]) => {
  _originalError.apply(console, args);
  try {
    //added the error log for last 50 entries
    const MAX_ERRORS = 50;
    const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]');
    errorLog.push({ time: Date.now(), args: args.map((a) => String(a)) });
    localStorage.setItem('errorLog', JSON.stringify(errorLog.slice(-MAX_ERRORS)));
  } catch (e) {
    /* storage full */
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
