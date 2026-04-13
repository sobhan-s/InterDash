import React, { useState, useMemo, useRef, useCallback } from "react";

import { AppContext } from "./AppContext";

export const AppProvider = ({ children }: any) => {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [appData, setAppData] = useState<any>({});
  const [counter, setCounter] = useState(0);
  const [routeHistory, setRouteHistory] = useState<string[]>([]);
  const [debugMode, setDebugMode] = useState(false);

  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);

  const [toasts, setToasts] = useState<any[]>([]);
  
  const toastRef = useRef(0);

  const addToast = useCallback((message: string, type = 'info') => {
    const id = ++toastRef.current;
    setToasts(prev => [...prev, { id, message, type }].slice(-5));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo(() => ({
    theme, user, notifications, sidebarOpen, globalSearchQuery,
    appData, counter, routeHistory, debugMode,
    posts, users, todos, comments, albums, photos,
    toasts, isLoading,
    setUser, setNotifications, setSidebarOpen,
    setGlobalSearchQuery, setAppData, setCounter,
    setRouteHistory, setDebugMode,
    setPosts, setUsers, setTodos, setComments,
    setAlbums, setPhotos,
    addToast, handleThemeToggle ,setIsLoading
  }), [
    theme, user, notifications, sidebarOpen, globalSearchQuery,
    appData, counter, routeHistory, debugMode,
    posts, users, todos, comments, albums, photos, toasts,isLoading
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};