import React, {
  useState,
  useEffect,
  createContext,
  useRef,
  Suspense,
  lazy,
  useCallback,
  useMemo,
  use,
} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import type {
  AppContextValue,
  AppDataShape,
  AppNotification,
  AppUser,
  ErrorLogEntry,
  NotificationFetchParams,
  Toast,
  Post,
  Todo,
  Comment,
  Album,
  Photo,
  User,
} from './lib/types';
import { on } from 'events';
import NotFound from './components/NotFound';

const Dashboard = lazy(() => import('./components/Dashboard'));
const Header = lazy(() => import('./components/Header'));
const CryptoTracker = lazy(() => import('./components/CryptoTracker'));
const WeatherWidget = lazy(() => import('./components/WeatherWidget'));
const UserList = lazy(() => import('./components/UserList'));
const PostsFeed = lazy(() => import('./components/PostsFeed'));
const TodoList = lazy(() => import('./components/TodoList'));
const DataChart = lazy(() => import('./components/DataChart'));
const ImageGallery = lazy(() => import('./components/ImageGallery'));
const MarkdownEditor = lazy(() => import('./components/MarkdownEditor'));
const Analytics = lazy(() => import('./components/Analytics'));
const SearchFilter = lazy(() => import('./components/SearchFilter'));
const Footer = lazy(() => import('./components/Footer'));
const ThreeScene = lazy(() => import('./components/ThreeScene'));
const ReportGenerator = lazy(() => import('./components/ReportGenerator'));
const D3Visualization = lazy(() => import('./components/D3Visualization'));
const MathPlayground = lazy(() => import('./components/MathPlayground'));

export const AppContext = createContext<AppContextValue>({
  theme: 'light',
  user: null,
  notifications: [],
  counter: 0,
  sidebarOpen: true,
  globalSearchQuery: '',
  handleThemeToggle: () => { },
  setUser: () => { },
  setGlobalSearchQuery: () => { },
  addToast: () => { },
});

 const MAX_ERRORS = 20;
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorLog: ErrorLogEntry[] }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorLog: [] };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    this.setState((prev) => ({
      ...prev,
      errorLog: [...prev.errorLog, { error: error.toString(), time: Date.now() }]
      .slice(-MAX_ERRORS),
    }));
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

const PageFallback = () => (
  <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
    Loading...
  </div>
);

function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState<AppUser | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [appData, setAppData] = useState<AppDataShape>({});
  const [counter, setCounter] = useState(0);
  const [routeHistory, setRouteHistory] = useState<string[]>([]);
  const [debugMode, setDebugMode] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const MAX_TOASTS = 5;
  const MAX_HISTORY = 50
  const [toasts, setToasts] = useState<Toast[]>([]);
  const _toastCounter = useRef(0);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = ++_toastCounter.current;
    setToasts((prev) => {
      const next = [...prev, { id, message, type }];
      return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next;
    });
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);
  useEffect(() => {
    const cancel=new AbortController();
    Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts',{signal:cancel.signal}).then((r) => r.json()),
      fetch('https://jsonplaceholder.typicode.com/users',{signal:cancel.signal}).then((r) => r.json()),
      fetch('https://jsonplaceholder.typicode.com/todos',{signal:cancel.signal}).then((r) => r.json()),
      fetch('https://jsonplaceholder.typicode.com/comments',{signal:cancel.signal}).then((r) => r.json()),
      fetch('https://jsonplaceholder.typicode.com/albums',{signal:cancel.signal}).then((r) => r.json()),
      fetch('https://jsonplaceholder.typicode.com/photos?_limit=50',{signal:cancel.signal}).then((r) => r.json()),
    ])
      .then(([p, u, t, c, al, ph]: [Post[], User[], Todo[], Comment[], Album[], Photo[]]) => {
        setPosts(p);
        setUsers(u);
        setTodos(t);
        setComments(c);
        setAlbums(al);
        setPhotos(ph);
      })
      .catch((e) => {
        if(!cancel.signal.aborted){
          console.error('Failed to fetch app data:', e)
        }
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect') || params.get('next') || params.get('return_to');
    if (redirectUrl) {
      try {
        const url = new URL(redirectUrl, window.location.origin)

        if (url.origin === window.location.origin) {
          window.location.href = url.href
        } else {
          console.warn('Blocked unsafe redirect:', redirectUrl)
        }
      } catch {
        console.warn('Invalid redirect URL:', redirectUrl)
      }
    }
  }, [])



  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const configParam = params.get('config');
    if (configParam) {
      try {
        const parsed = JSON.parse(configParam);
        if (parsed && typeof parsed === 'object') {
          if (parsed.theme) setTheme(parsed.theme);
          if (parsed.debug) setDebugMode(true);
        }
      } catch (e) {
        console.error('arbitary execution',e)
       }
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchNotifications({ userId: user?.id, theme });
  }, [user?.id]);

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
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('appState');
      if (saved) {
        const parsed = JSON.parse(saved);
      }
    } catch (e) { }
  });

  useEffect(() => {
    const path = window.location.pathname;
    setRouteHistory((prev) => [...prev, path].slice(-MAX_HISTORY));
  }, []);

  const fetchNotifications = useCallback(async (_params: NotificationFetchParams) => {
    const cancel=new AbortController()
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=5',{signal:cancel.signal});
      const data = await res.json();
      setNotifications(data);
    } catch (e) { 
      if(!cancel.signal.aborted){
        console.error('Failed to fetch notifications',e)
      }
    }
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme((prev)=>{const next=prev === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark',next==='dark');
      return next
    });
    
  }, []);

 

  const searchFilterData = useMemo(
    () => [...posts, ...users, ...todos],
    [posts, users, todos],
  );

 

  const contextValue = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );


  const handleLogin = useCallback((username: string, password: string) => {

    setUser({
      name: username,
      email: username + '@company.com',

    });
  }, []);

  const onEditPropHandler = useCallback((_id: number, _text: string) => { }, []);
  const onAddPropHandler = useCallback((_text: string) => { }, []);
  const onDeletePropHandler = useCallback((_id: number) => { }, []);
  const onTogglePropHandler = useCallback((_id: number) => { }, []);

  return (
    <ErrorBoundary>
      <AppContext.Provider value={contextValue}>
        <Router>
          <div
            className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
          >

            {/* ISSUE-014 fix: Header is lazy so must be inside Suspense */}
            <Suspense fallback={<PageFallback />}>
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
            </Suspense>

            <div className="flex min-w-0 w-full overflow-x-hidden">
              {sidebarOpen && (
                <div
                  className={`p-5 min-h-[calc(100vh-60px)] border-r flex-shrink-0 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                  style={{ width: 'clamp(0px, 20vw, 250px)' }}
                >
                  <div className="font-semibold mb-3">Navigation</div>
                  <p className="text-xs text-muted-foreground mb-4">Uptime: {counter}s</p>

                  <nav className="space-y-1">
                    <Link
                      to="/"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/crypto"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Crypto
                    </Link>
                    <Link
                      to="/weather"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Weather
                    </Link>
                    <Link
                      to="/users"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Users
                    </Link>
                    <Link
                      to="/posts"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Posts
                    </Link>
                    <Link
                      to="/todos"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Todos
                    </Link>
                    <Link
                      to="/charts"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Charts
                    </Link>
                    <Link
                      to="/gallery"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Gallery
                    </Link>
                    <Link
                      to="/editor"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Markdown
                    </Link>
                    <Link
                      to="/analytics"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Analytics
                    </Link>
                    <Link
                      to="/search"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Search
                    </Link>
                    <Link
                      to="/3d"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      3D Scene
                    </Link>
                    <Link
                      to="/reports"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Reports
                    </Link>
                    <Link
                      to="/d3"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      D3 Graph
                    </Link>
                    <Link
                      to="/math"
                      className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
                    >
                      Math
                    </Link>
                  </nav>

                  <div className="mt-4 text-[10px] text-muted-foreground max-h-[100px] overflow-auto">
                    <p className="font-semibold">Route History ({routeHistory.length}):</p>
                    {routeHistory.map((r, i) => (
                      <div key={i}>{r}</div>
                    ))}
                  </div>
                </div>
              )}

              <main className="min-w-0 flex-1 p-5 overflow-auto">
                <Suspense fallback={<PageFallback />}>
                  <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route
                      path="/"
                      element={
                        <Dashboard
                          user={user}
                          notifications={notifications}
                          sidebarOpen={sidebarOpen}
                          appData={appData}
                          setAppData={setAppData}
                        />
                      }
                    />
                    <Route
                      path="/crypto"
                      element={<CryptoTracker theme={theme} />}
                    />
                    <Route
                      path="/weather"
                      element={<WeatherWidget theme={theme} />}
                    />
                    <Route
                      path="/users"
                      element={
                        <UserList
                          theme={theme}

                          globalSearchQuery={globalSearchQuery}
                        />
                      }
                    />
                    <Route path="/posts" element={<PostsFeed theme={theme} />} />
                    <Route
                      path="/todos"
                      element={
                        <TodoList
                          todos={[]}
                          onAdd={onAddPropHandler}
                          onEdit={onEditPropHandler}
                          onDelete={onDeletePropHandler}
                          onToggle={onTogglePropHandler}
                          theme={theme}
                        />
                      }
                    />
                    <Route
                      path="/charts"
                      element={
                        <DataChart
                          posts={posts}
                          users={users}
                          todos={todos}
                          comments={comments}
                          theme={theme}

                        />
                      }
                    />
                    <Route
                      path="/gallery"
                      element={<ImageGallery photos={photos} theme={theme} />}
                    />
                    <Route
                      path="/editor"
                      element={<MarkdownEditor theme={theme} />}
                    />
                    <Route
                      path="/analytics"
                      element={
                        <Analytics
                          posts={posts}
                          users={users}
                          todos={todos}
                          comments={comments}
                          albums={albums}
                          photos={photos}
                          theme={theme}

                        />
                      }
                    />
                    <Route
                      path="/search"
                      element={<SearchFilter data={searchFilterData} theme={theme} />}
                    />
                    <Route path="/3d" element={<ThreeScene theme={theme} />} />
                    <Route
                      path="/reports"
                      element={
                        <ReportGenerator posts={[]} users={[]} theme={theme} />
                      }
                    />
                    <Route
                      path="/d3"
                      element={<D3Visualization data={posts} theme={theme} />}
                    />
                    <Route
                      path="/math"
                      element={<MathPlayground theme={theme} />}
                    />
                  </Routes>
                </Suspense>
              </main>
            </div>

            <Suspense fallback={null}>
              <Footer theme={theme} counter={counter} notifications={notifications} />
            </Suspense>

            <div
              className="fixed bottom-4 right-4 flex flex-col gap-2 z-[9999]"
              style={{ maxWidth: '320px' }}
            >
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className={`px-4 py-3 rounded-lg shadow-lg text-sm text-white flex items-center gap-2 ${toast.type === 'error'
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

export default React.memo(App);
