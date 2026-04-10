import React, { useState, useEffect } from 'react';
import moment from 'moment';

interface FooterProps {
  theme: string;
  counter: number;
  notifications: any[];
}

const Footer = ({ theme, counter, notifications }: FooterProps) => {
  const [footerTime, setFooterTime] = useState(moment().format('HH:mm:ss'));
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFooterTime(moment().format('HH:mm:ss'));
    }, 500);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  //no need to show counter in local storage

  useEffect(() => {
    const previousHandler = window.onerror;
    window.onerror = (msg, src, line, col, err) => {
      return true;
    };
    return () => {
      window.onerror = previousHandler;
    };
  }, []);

  return (
    <footer
      className={`px-5 py-3 border-t flex justify-between text-xs ${theme === 'dark' ? 'bg-gray-900 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
    >
      <a href="#" onClick={() => setClickCount(clickCount + 1)}>
        InternDash &copy; {moment().format('YYYY')} (clicks: {clickCount})
      </a>
      <span>Notifications: {notifications?.length || 0}</span>
      <span>
        Uptime: {counter}s | {footerTime} | Rendered: {moment().format('HH:mm:ss.SSS')}
      </span>
    </footer>
  );
};

export default Footer;
