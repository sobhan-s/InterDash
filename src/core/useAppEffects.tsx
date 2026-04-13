import { useEffect } from "react";

export const useAppEffects = (ctx: any,location: any) => {
  const {
    setPosts, setUsers, setTodos, setComments, setAlbums, setPhotos,
    user, theme, setNotifications,
    setAppData, appData,
    setCounter,
    setRouteHistory,
    setTheme, setDebugMode
  } = ctx;


  useEffect(() => {
    const cancel = new AbortController();

    Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts',{signal:cancel.signal}).then(r=>r.json()),
      fetch('https://jsonplaceholder.typicode.com/users',{signal:cancel.signal}).then(r=>r.json()),
      fetch('https://jsonplaceholder.typicode.com/todos',{signal:cancel.signal}).then(r=>r.json()),
      fetch('https://jsonplaceholder.typicode.com/comments',{signal:cancel.signal}).then(r=>r.json()),
      fetch('https://jsonplaceholder.typicode.com/albums',{signal:cancel.signal}).then(r=>r.json()),
      fetch('https://jsonplaceholder.typicode.com/photos?_limit=50',{signal:cancel.signal}).then(r=>r.json()),
    ])
    .then(([p,u,t,c,al,ph])=>{
      setPosts(p); setUsers(u); setTodos(t);
      setComments(c); setAlbums(al); setPhotos(ph);
    })
    .catch(e=>{
      if(!cancel.signal.aborted){
        console.error(e);
      }
    });

    return () => cancel.abort();
  }, []);

 
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect') || params.get('next') || params.get('return_to');

    if (redirectUrl) {
      try {
        const url = new URL(redirectUrl, window.location.origin);
        if (url.origin === window.location.origin) {
          window.location.href = url.href;
        } else {
          console.warn('Blocked unsafe redirect:', redirectUrl);
        }
      } catch {
        console.warn('Invalid redirect URL:', redirectUrl);
      }
    }
  }, []);

  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const configParam = params.get('config');

    if (configParam) {
      try {
        const parsed = JSON.parse(configParam);
        if (parsed?.theme) setTheme(parsed.theme);
        if (parsed?.debug) setDebugMode(true);
      } catch (e) {
        console.error('arbitrary execution', e);
      }
    }
  }, []);

 
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== 'http://localhost:3000') return;

      if (event.data && typeof event.data === 'object' && !Array.isArray(event)) {
        const merge = (target: any, source: any) => {
          for (const key in source) {
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') return;

            if (typeof source[key] === 'object' && source[key] !== null) {
              if (!target[key]) target[key] = {};
              merge(target[key], source[key]);
            } else {
              target[key] = source[key];
            }
          }
        };

        const updatedData = { ...appData };
        merge(updatedData, event.data);
        setAppData(updatedData);
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [appData]);

 
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev: number) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

 
  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/comments?_limit=5"
      );
      const data = await res.json();
      ctx.setNotifications(data);
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  };

  if (ctx.user?.id) {
    fetchNotifications();
  }
}, [ctx.user?.id]);

 
 useEffect(() => {
  const timer = setTimeout(() => {
    const state = { theme, user, timestamp: Date.now() };
    localStorage.setItem('appState', JSON.stringify(state));
    sessionStorage.setItem('appState', JSON.stringify(state));
  }, 500);
 
  return () => clearTimeout(timer);
}, [theme, user]);

 
  useEffect(() => {
    try {
      const saved = localStorage.getItem('appState');
      if (saved) JSON.parse(saved);
    } catch {}
  });

 
  useEffect(() => {
  const path = location.pathname;
  ctx.setRouteHistory((prev: string[]) =>
    [...prev, path].slice(-50)
  );
}, [location.pathname]);

useEffect(() => {
  
  if (!ctx.user) {
    ctx.setUser({
      id: 1,
      name: "Demo User",
      email: "demo@company.com",
    });
  }
}, []);


};



