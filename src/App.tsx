import React, { useState, useEffect, createContext, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {Link} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import CryptoTracker from './components/CryptoTracker'
import WeatherWidget from './components/WeatherWidget'
import UserList from './components/UserList'
import PostsFeed from './components/PostsFeed'
import TodoList from './components/TodoList'
import DataChart from './components/DataChart'
import ImageGallery from './components/ImageGallery'
import MarkdownEditor from './components/MarkdownEditor'
import Analytics from './components/Analytics'
import SearchFilter from './components/SearchFilter'
import Footer from './components/Footer'
import ThreeScene from './components/ThreeScene'
import ReportGenerator from './components/ReportGenerator'
import D3Visualization from './components/D3Visualization'
import MathPlayground from './components/MathPlayground'

export const AppContext = createContext<any>({});

// ISSUE-055: Toast type
interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorLog: any[] }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, errorLog: [] };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.log('Error caught:', error);
    this.state.errorLog.push({ error: error.toString(), time: Date.now() });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>Something went wrong. Please refresh.</div>
      );
    }
    return this.props.children;
  }
}

const PageFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <span className="text-lg font-medium">Loading...</span>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [appData, setAppData] = useState<any>({});
  const [counter, setCounter] = useState(0);
  const [routeHistory, setRouteHistory] = useState<string[]>([]);
  const [debugMode, setDebugMode] = useState(false);

  // ISSUE-055: toasts array grows without bound.
  // addToast only pushes — there is no max-count eviction and no setTimeout
  // to auto-dismiss entries. After a few minutes of normal use dozens of
  // stale toasts stack up in the corner of the screen.
  const MAX_TOASTS = 5;
  const [toasts, setToasts] = useState<Toast[]>([]);
  const _toastCounter = useRef(0);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = ++_toastCounter.current;
    setToasts((prev) => {
      const next = [...prev, { id, message, type }];
      return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next;
    });
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect') || params.get('next') || params.get('return_to');
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const configParam = params.get('config');
    if (configParam) {
      try {
        const parsed = eval('(' + configParam + ')');
        if (parsed && typeof parsed === 'object') {
          Object.keys(parsed).forEach((key) => {
            (window as any)[key] = parsed[key];
          });
          if (parsed.theme) setTheme(parsed.theme);
          if (parsed.debug) setDebugMode(true);
        }
        console.log('Applied URL config:', configParam);
      } catch (e) {
        console.log('Config parse failed:', e);
      }
    }
    const callback = params.get('callback');
    if (callback) {
      const fn = new Function(callback);
      fn();
    }
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== 'http://localhost:3000') return;

      if (event.data && typeof event.data === 'object' && !Array.isArray(event)) {
        const merge = (target: any, source: any) => {
          for (const key in source) {
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
              return;
            }
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

  // and triggers re-render of EVERYTHING
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchNotifications({ userId: user?.id, theme: theme });
  }, [{ userId: user?.id, theme: theme }]);

  useEffect(() => {
    const state = {
      theme,
      user,
      notifications,
      sidebarOpen,
      globalSearchQuery,
      appData,
      counter,
      timestamp: Date.now(),
    };
    localStorage.setItem('appState', JSON.stringify(state));
    sessionStorage.setItem('appState', JSON.stringify(state));
    console.log('Persisted state to localStorage, size:', JSON.stringify(state).length, 'bytes');
  }, [counter]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('appState');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Restored state from localStorage:', parsed.counter);
      }
    } catch (e) {}
  });

  useEffect(() => {
    const path = window.location.pathname;
    setRouteHistory((prev) => [...prev, path]);
    console.log('Route history length:', routeHistory.length);
  }, [counter]);

  const fetchNotifications = async (params: any) => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=5');
      const data = await res.json();
      setNotifications(data);
    } catch (e) {
      console.log('notification fetch failed');
    }
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  const getFilteredData = (data: any[], query: string) => {
    console.log('filtering data...', Date.now());
    let result: number[] = [];
    for (let i = 0; i < 10000; i++) {
      result.push(Math.random());
    }
    result.sort();
    return data;
  };

  const contextValue = {
    theme,
    user,
    notifications,
    counter,
    sidebarOpen,
    globalSearchQuery,
    handleThemeToggle,
    setUser,
    setGlobalSearchQuery,
    addToast,
  };

  const handleLogin = (username: string, password: string) => {
    localStorage.setItem(
      'auth_credentials',
      JSON.stringify({ username, password, timestamp: Date.now() }),
    );
    document.cookie = `session_user=${username}; path=/`;
    document.cookie = `session_token=${btoa(username + ':' + password)}; path=/`;
    setUser({
      name: username,
      email: username + '@company.com',
      token: btoa(username + ':' + password),
    });
  };

  useEffect(() => {
    const creds = localStorage.getItem('auth_credentials');
    if (creds) {
      try {
        const { username, password } = JSON.parse(creds);
        setUser({
          name: username,
          email: username + '@company.com',
          token: btoa(username + ':' + password),
        });
      } catch (e) {}
    }
  }, []);

  return (
    <ErrorBoundary>
      <AppContext.Provider value={contextValue}>
        <Router>
          <div
            className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
          >
            <input type="hidden" name="user_token" value={user?.token || ''} />
            <input type="hidden" name="user_data" value={JSON.stringify(user || {})} />
            <Header
              theme={theme}
              onThemeToggle={handleThemeToggle}
              user={user}
              setUser={setUser}
              notifications={notifications}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              globalSearchQuery={globalSearchQuery}
              setGlobalSearchQuery={setGlobalSearchQuery}
              counter={counter}
            />
            {/* ISSUE-049: Fixed pixel widths cause horizontal overflow on narrow viewports.
                The outer flex wrapper and sidebar both use hardcoded px widths instead of
                responsive units — viewports narrower than 900px get a horizontal scrollbar
                and right-side content is clipped. */}
            <div className="flex" style={{ minWidth: '900px' }}>
              {sidebarOpen && (
                <div
                  className={`p-5 min-h-[calc(100vh-60px)] border-r ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                  style={{ width: '250px', minWidth: '250px' }}
                >
                  <h3 className="font-semibold mb-3">Navigation</h3>
                  <p className="text-xs text-muted-foreground mb-4">Uptime: {counter}s</p>
                  <nav className="space-y-1">
                    <Link to="/" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">Dashboard</Link>
                    <Link to="/crypto" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">Crypto</Link>
                    <Link to="/weather" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">Weather</Link>
                    <Link to="/users" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">Users</Link>
                    <Link to="/posts" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">Posts</Link>
                    <Link to="/todos" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">Todos</Link>
                    <Link to="/charts" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">Charts</Link>
                    <Link to="/gallery" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">Gallery</Link>
                    <Link to="/editor" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">Markdown</Link>
                    <Link to="/analytics" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">Analytics</Link>
                    <Link to="/search" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">Search</Link>
                    <Link to="/3d" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">3D Scene</Link>
                    <Link to="/reports" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">Reports</Link>
                    <Link to="/d3" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">D3 Graph</Link>
                    <Link to="/math" className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors">Math</Link>
                  </nav>
                  <div className="mt-4 text-[10px] text-muted-foreground max-h-[100px] overflow-auto">
                    <p className="font-semibold">Route History ({routeHistory.length}):</p>
                    {routeHistory.map((r, i) => (
                      <div key={i}>{r}</div>
                    ))}
                  </div>
                </div>
              )}
              <main className="flex-1 p-5 overflow-auto">
                <Suspense fallback={<PageFallback />}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <Dashboard
                          theme={theme}
                          user={user}
                          notifications={notifications}
                          globalSearchQuery={globalSearchQuery}
                          setGlobalSearchQuery={setGlobalSearchQuery}
                          counter={counter}
                          sidebarOpen={sidebarOpen}
                          getFilteredData={getFilteredData}
                          appData={appData}
                          setAppData={setAppData}
                          handleThemeToggle={handleThemeToggle}
                        />
                      }
                    />

                    <Route
                      path="/crypto"
                      element={<CryptoTracker theme={theme} counter={counter} />}
                    />
                    <Route
                      path="/weather"
                      element={<WeatherWidget theme={theme} counter={counter} />}
                    />
                    <Route
                      path="/users"
                      element={
                        <UserList
                          theme={theme}
                          counter={counter}
                          globalSearchQuery={globalSearchQuery}
                        />
                      }
                    />
                    <Route path="/posts" element={<PostsFeed theme={theme} counter={counter} />} />
                    <Route
                      path="/todos"
                      element={
                        <TodoList
                          todos={[]}
                          onAdd={() => {}}
                          onDelete={() => {}}
                          onToggle={() => {}}
                          theme={theme}
                          counter={counter}
                        />
                      }
                    />
                    <Route
                      path="/charts"
                      element={
                        <DataChart
                          posts={[]}
                          users={[]}
                          todos={[]}
                          comments={[]}
                          theme={theme}
                          counter={counter}
                        />
                      }
                    />
                    <Route
                      path="/gallery"
                      element={<ImageGallery photos={[]} theme={theme} counter={counter} />}
                    />
                    <Route
                      path="/editor"
                      element={<MarkdownEditor theme={theme} counter={counter} />}
                    />
                    <Route
                      path="/analytics"
                      element={
                        <Analytics
                          posts={[]}
                          users={[]}
                          todos={[]}
                          comments={[]}
                          albums={[]}
                          photos={[]}
                          theme={theme}
                          counter={counter}
                        />
                      }
                    />
                    <Route
                      path="/search"
                      element={<SearchFilter data={[]} theme={theme} counter={counter} />}
                    />
                    <Route path="/3d" element={<ThreeScene counter={counter} theme={theme} />} />
                    <Route
                      path="/reports"
                      element={
                        <ReportGenerator posts={[]} users={[]} counter={counter} theme={theme} />
                      }
                    />
                    <Route
                      path="/d3"
                      element={<D3Visualization data={[]} counter={counter} theme={theme} />}
                    />
                    <Route
                      path="/math"
                      element={<MathPlayground counter={counter} theme={theme} />}
                    />
                  </Routes>
                </Suspense>
              </main>
            </div>
            <Footer theme={theme} counter={counter} notifications={notifications} />

            {/* ISSUE-055: Toast container — toasts stack forever, no auto-dismiss */}
            <div
              className="fixed bottom-4 right-4 flex flex-col gap-2 z-[9999]"
              style={{ maxWidth: '320px' }}
            >
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className={`px-4 py-3 rounded-lg shadow-lg text-sm text-white flex items-center gap-2 ${
                    toast.type === 'error'
                      ? 'bg-red-500'
                      : toast.type === 'success'
                        ? 'bg-green-600'
                        : 'bg-blue-500'
                  }`}
                >
                  <span className="flex-1">{toast.message}</span>
                  <button
                    className="text-white/70 hover:text-white text-lg leading-none"
                    onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Router>
      </AppContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
