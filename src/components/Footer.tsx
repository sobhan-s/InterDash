import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { FooterProps } from '@/lib/types';

const Footer = ({ theme, counter, notifications }: FooterProps) => {
  const [footerTime, setFooterTime] = useState(format(new Date(), 'HH:mm:ss'));
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFooterTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <footer
      className={`px-5 py-3 border-t flex justify-between text-xs ${theme === 'dark' ? 'bg-gray-900 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
    >
      <button aria-label="time" onClick={() => setClickCount(clickCount + 1)}>
        InternDash &copy; {format(new Date(), 'yyyy')} (clicks: {clickCount})
      </button>
      <span>Notifications: {notifications?.length || 0}</span>
      <span>
        Uptime: {counter}s | {footerTime} | Rendered: {format(new Date(), 'HH:mm:ss.SSS')}
      </span>
    </footer>
  );
};

export default Footer;
