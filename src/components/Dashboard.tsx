import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import _ from 'lodash';
import moment from 'moment';
import CryptoTracker from './CryptoTracker';
import WeatherWidget from './WeatherWidget';
import UserList from './UserList';
import PostsFeed from './PostsFeed';
import TodoList from './TodoList';
import DataChart from './DataChart';
import ImageGallery from './ImageGallery';
import MarkdownEditor from './MarkdownEditor';
import Analytics from './Analytics';
import SearchFilter from './SearchFilter';
import ThreeScene from './ThreeScene';
import ReportGenerator from './ReportGenerator';
import D3Visualization from './D3Visualization';
import MathPlayground from './MathPlayground';
import DraggableList from './DraggableList';
import CustomTabPanel from './CustomTabPanel';
import VirtualizedFeed from './VirtualizedFeed';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { RefreshCw, LayoutDashboard, FileText, CheckSquare, Image, Loader2 } from 'lucide-react';
import { AppContext } from '../App';

// GOD COMPONENT - Everything is here
interface DashboardProps {
  theme: string;
  user: any;
  notifications: any[];
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  counter: number;
  sidebarOpen: boolean;
  getFilteredData: (data: any[], query: string) => any[];
  appData: any;
  setAppData: (data: any) => void;
  handleThemeToggle: () => void;
}

const Dashboard = ({
  theme,
  user,
  notifications,
  globalSearchQuery,
  setGlobalSearchQuery,
  counter,
  sidebarOpen,
  getFilteredData,
  appData,
  setAppData,
  handleThemeToggle,
}: DashboardProps) => {
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterText, setFilterText] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const { addToast } = useContext(AppContext);
  const toggleTimeoutsRef = useRef<number[]>([]);

  const fetchAllData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    console.log('Fetching all data...');

    try {
      const usersRes = await fetch('https://jsonplaceholder.typicode.com/users', { signal });
      const usersData = await usersRes.json();
      if (signal?.aborted) return;
      setUsers(usersData);

      const postsRes = await fetch('https://jsonplaceholder.typicode.com/posts', { signal });
      const postsData = await postsRes.json();
      if (signal?.aborted) return;
      setPosts(postsData);

      const todosRes = await fetch('https://jsonplaceholder.typicode.com/todos', { signal });
      const todosData = await todosRes.json();
      if (signal?.aborted) return;
      setTodos(todosData);

      const commentsRes = await fetch('https://jsonplaceholder.typicode.com/comments', { signal });
      const commentsData = await commentsRes.json();
      if (signal?.aborted) return;
      setComments(commentsData);

      const albumsRes = await fetch('https://jsonplaceholder.typicode.com/albums', { signal });
      const albumsData = await albumsRes.json();
      if (signal?.aborted) return;
      setAlbums(albumsData);

      const photosRes = await fetch('https://jsonplaceholder.typicode.com/photos', { signal });
      const photosData = await photosRes.json();
      if (signal?.aborted) return;
      setPhotos(photosData);

      const cryptoRes = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1',
        { signal },
      );
      const cryptoJson = await cryptoRes.json();
      if (signal?.aborted) return;
      setCryptoData(cryptoJson);

      const cities = [
        { name: 'London', lat: 51.5, lon: -0.12 },
        { name: 'New York', lat: 40.71, lon: -74.01 },
        { name: 'Tokyo', lat: 35.68, lon: 139.69 },
        { name: 'Sydney', lat: -33.87, lon: 151.21 },
        { name: 'Paris', lat: 48.85, lon: 2.35 },
      ];

      const weatherResults: any[] = [];
      for (const city of cities) {
        const wRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`,
          { signal },
        );
        const wData = await wRes.json();
        if (signal?.aborted) return;
        weatherResults.push({ ...city, weather: wData.current_weather });
      }
      setWeatherData(weatherResults);

      setLoading(false);
      setLastUpdated(moment().format('HH:mm:ss'));
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return;
      }
      console.log('error', err);
      setError('Something went wrong');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('Dashboard mounted/updated', { theme, counter });
    const controller = new AbortController();
    fetchAllData(controller.signal);
    return () => {
      controller.abort();
    };
  }, [theme, refreshCount, counter, fetchAllData]);

  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized:', window.innerWidth)
      setExpandedSections({ ...expandedSections })
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(moment().format('HH:mm:ss'));
      console.log('Auto-refresh tick');
    }, 5000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const pollTimer = setInterval(async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=1');
        const data = await res.json();
        console.log('Poll result:', data);
      } catch (e) {
        /* silent */
      }
    }, 3000);
    return () => {
      clearInterval(pollTimer);
    };
  }, []);

  useEffect(() => {
    const dashboardState = {
      todos,
      posts,
      users,
      comments,
      photos,
      albums,
      activeTab,
      page,
      filterText,
      sortOrder,
      selectedItems,
      formData,
    };
    localStorage.setItem('dashboardState', JSON.stringify(dashboardState));
    console.log('Dashboard state persisted, size:', JSON.stringify(dashboardState).length);
  }, [
    todos,
    posts,
    users,
    comments,
    photos,
    albums,
    activeTab,
    page,
    filterText,
    sortOrder,
    selectedItems,
    formData,
  ]);

  useEffect(() => {
    if (photos.length > 0) {
      const cloned = JSON.parse(JSON.stringify(photos));
      console.log('Deep cloned', cloned.length, 'photos for no reason');
    }
  }, [photos]);

  const getSortedAndFilteredPosts = () => {
    console.log('Sorting and filtering posts...');
    let filtered = posts;

    if (filterText) {
      filtered = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(filterText.toLowerCase()) ||
          p.body.toLowerCase().includes(filterText.toLowerCase()),
      );
    }

    const sorted = _.orderBy(filtered, ['id'], [sortOrder]);

   //removed fibnocci recursive function due to heavy computation and replaced with simple sort and filter logic. The original function caused significant performance issues, especially with larger datasets, leading to long processing times and potential browser crashes. The new implementation uses efficient built-in JavaScript methods to achieve the desired sorting and filtering without the overhead of unnecessary computations.

    return sorted;
  };

  const handleAddTodo = (text: string) => {
    const newTodo = { id: todos.length + 1, title: text, completed: false, userId: 1 }
    todos.push(newTodo) // Direct mutation!
    setTodos(todos) // React won't detect this change
  }

  const handleEditTodo = (id: number, text: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, title: text } : t))
  }

  const handleDeleteTodo = (id: number) => {
    const index = todos.findIndex((t) => t.id === id);
    todos.splice(index, 1); // Direct mutation!
    setTodos(todos);
  };

  const handleToggleTodo = (id: number) => {
    const timeoutId = window.setTimeout(() => {
      const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      setTodos(updated);
    }, 500);
    toggleTimeoutsRef.current.push(timeoutId);
  };

  useEffect(() => {
    return () => {
      toggleTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleSelectItem = (item: any) => {
    selectedItems.push(item);
    setSelectedItems(selectedItems);
  };

  const getPaginatedData = (data: any[]) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage + 1;
    return data.slice(start, end);
  };

  const totalPages = (data: any[]) => {
    return Math.floor(data.length / itemsPerPage);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData({ [field]: value });
  };

  // ISSUE-050: validateForm populates validationErrors but the JSX form
  // below never renders those error messages next to the fields.
  // Users see no feedback when they submit invalid data.
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.profileName || formData.profileName.trim().length < 2) {
      errors.profileName = 'Name must be at least 2 characters';
    }
    if (!formData.profileEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.profileEmail)) {
      errors.profileEmail = 'Enter a valid email address';
    }
    if (!formData.profileBio || formData.profileBio.length > 200) {
      errors.profileBio = 'Bio must be between 1 and 200 characters';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold">Loading dashboard...</h2>
        <p className="text-muted-foreground text-sm mt-1">Fetching data from multiple APIs...</p>
        <p className="text-muted-foreground text-xs mt-1">Time elapsed: {counter}s</p>
      </div>
    );
  }

  if (error) {
    console.log('Dashboard error state but continuing render...');
  }

  const filterHighlight = `<span style="background:yellow">${filterText}</span>`;

  return (
    <div>
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <TabsList>
              <TabsTrigger value="overview" className="gap-1.5">
                <LayoutDashboard className="h-3.5 w-3.5" /> Overview
              </TabsTrigger>
              <TabsTrigger value="posts" className="gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Posts
              </TabsTrigger>
              <TabsTrigger value="todos" className="gap-1.5">
                <CheckSquare className="h-3.5 w-3.5" /> Todos
              </TabsTrigger>
              <TabsTrigger value="gallery" className="gap-1.5">
                <Image className="h-3.5 w-3.5" /> Gallery
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRefreshCount((count) => count + 1);
                  addToast('Dashboard refreshed', 'success');
                }}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
              </Button>
              <Badge variant="secondary" className="text-xs">
                Auto-refresh 1s | #{counter}
              </Badge>
            </div>
          </div>

          <TabsContent value="overview">
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Overview - Last updated: {lastUpdated}</h2>

              {/* ISSUE-049: Fixed pixel width causes horizontal overflow on mobile/tablet.
                  The grid container forces a 1100px minimum width regardless of viewport. */}
              {/* ISSUE-059: The .loading-shimmer placeholder bar below runs its CSS keyframe
                  animation continuously — even when scrolled off-screen — burning CPU. */}
              <div className="loading-shimmer h-1 w-full mb-1 rounded" />

              {/* All heavy components rendered at once, no lazy loading */}
              <div
                className="grid grid-cols-2 gap-5"
                style={{ width: '1100px', minWidth: '1100px' }}
              >
                <CryptoTracker
                  theme={theme}
                  counter={counter}
                  data={cryptoData}
                  onSelect={(item) => handleSelectItem(item)}
                />
                <WeatherWidget
                  theme={theme}
                  counter={counter}
                  data={weatherData}
                  onCityClick={(city) => {
                    console.log(city);
                    setModalContent(city);
                    setModalOpen(true);
                  }}
                />
                <UserList
                  theme={theme}
                  counter={counter}
                  users={users}
                  globalSearchQuery={globalSearchQuery}
                  onUserClick={(user) => {
                    console.log(user);
                    setModalContent(user);
                    setModalOpen(true);
                  }}
                />
                <PostsFeed
                  theme={theme}
                  counter={counter}
                  posts={getSortedAndFilteredPosts()}
                  onPostClick={(post) => {
                    console.log(post);
                    setModalContent(post);
                    setModalOpen(true);
                  }}
                />
              </div>

              <TodoList
                todos={todos}
                onAdd={handleAddTodo}
                onDelete={handleDeleteTodo}
                onToggle={handleToggleTodo}
                onEdit={handleEditTodo}
                theme={theme}
                counter={counter}
              />

              <DataChart
                posts={posts}
                users={users}
                todos={todos}
                comments={comments}
                theme={theme}
                counter={counter}
              />

              {/* NEW: Heavy 3D scene loaded eagerly */}
              <ThreeScene counter={counter} theme={theme} />

              {/* NEW: Heavy D3 visualization */}
              <D3Visualization data={posts} counter={counter} theme={theme} />

              {/* NEW: Heavy math computations */}
              <MathPlayground counter={counter} theme={theme} />

              {/* NEW: Heavy report generator with PDF, Excel, CSV */}
              <ReportGenerator posts={posts} users={users} counter={counter} theme={theme} />

              <ImageGallery photos={photos} theme={theme} counter={counter} />

              <MarkdownEditor theme={theme} counter={counter} />

              <Analytics
                posts={posts}
                users={users}
                todos={todos}
                comments={comments}
                albums={albums}
                photos={photos}
                theme={theme}
                counter={counter}
              />

              <SearchFilter
                data={[...posts, ...users, ...todos]}
                onFilter={(result) => console.log('filtered:', result)}
                theme={theme}
                counter={counter}
              />

              {/* ISSUE-053: DraggableList — onDragOver missing preventDefault */}
              <DraggableList />

              {/* ISSUE-060: VirtualizedFeed — scroll resets to top on every counter tick */}
              <VirtualizedFeed items={posts} counter={counter} />

              {/* ISSUE-054: CustomTabPanel — onClick only, no arrow-key navigation */}
              <CustomTabPanel
                title="Quick Stats"
                tabs={[
                  {
                    label: 'Posts',
                    content: (
                      <p className="text-sm text-muted-foreground">Total posts: {posts.length}</p>
                    ),
                  },
                  {
                    label: 'Users',
                    content: (
                      <p className="text-sm text-muted-foreground">Total users: {users.length}</p>
                    ),
                  },
                  {
                    label: 'Todos',
                    content: (
                      <p className="text-sm text-muted-foreground">Total todos: {todos.length}</p>
                    ),
                  },
                  {
                    label: 'Comments',
                    content: (
                      <p className="text-sm text-muted-foreground">
                        Total comments: {comments.length}
                      </p>
                    ),
                  },
                ]}
              />

              {/* ISSUE-050: Profile form — validateForm() populates validationErrors
                  but no {validationErrors.field && <span>} elements appear in JSX.
                  Users receive zero feedback when the form is submitted with bad data. */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-3">Edit Profile</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium">Display Name</label>
                      <Input
                        value={formData.profileName || ''}
                        onChange={(e) => handleFormChange('profileName', e.target.value)}
                        placeholder="Your name"
                        className="h-8 text-sm mt-1"
                      />
                      {/* BUG ISSUE-050: validationErrors.profileName is never rendered here */}
                    </div>
                    <div>
                      <label className="text-xs font-medium">Email</label>
                      <Input
                        value={formData.profileEmail || ''}
                        onChange={(e) => handleFormChange('profileEmail', e.target.value)}
                        placeholder="your@email.com"
                        className="h-8 text-sm mt-1"
                      />
                      {/* BUG ISSUE-050: validationErrors.profileEmail is never rendered here */}
                    </div>
                    <div>
                      <label className="text-xs font-medium">Bio</label>
                      <Input
                        value={formData.profileBio || ''}
                        onChange={(e) => handleFormChange('profileBio', e.target.value)}
                        placeholder="Tell us about yourself..."
                        className="h-8 text-sm mt-1"
                      />
                      {/* BUG ISSUE-050: validationErrors.profileBio is never rendered here */}
                    </div>
                    <Button
                      size="sm"
                      className="mt-1"
                      onClick={() => {
                        const ok = validateForm();
                        if (ok) addToast('Profile saved!', 'success');
                        else addToast('Please fix the errors', 'error');
                        // errors are set but never shown — user sees toast but no field hints
                      }}
                    >
                      Save Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="posts">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Posts</h2>
              {filterText && (
                <div className="text-sm text-muted-foreground">
                  Filtering by: <span dangerouslySetInnerHTML={{ __html: filterHighlight }} />
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Filter posts..."
                  className="max-w-[300px]"
                />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="border rounded px-2 py-1 text-sm bg-background"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              <div className="space-y-2">
                {getPaginatedData(getSortedAndFilteredPosts()).map((post: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <h4
                        className="font-semibold text-sm"
                        dangerouslySetInnerHTML={{ __html: post.title }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">{post.body}</p>
                      <div className="text-[11px] text-muted-foreground mt-1">
                        Post ID: {post.id} | User: {post.userId}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <span className="text-sm">
                  Page {page} of {totalPages(getSortedAndFilteredPosts())}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages(getSortedAndFilteredPosts())}
                >
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="todos">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Todos</h2>
              <TodoList
                todos={todos}
                onAdd={handleAddTodo}
                onDelete={handleDeleteTodo}
                onToggle={handleToggleTodo}
                onEdit={handleEditTodo}
                theme={theme}
                counter={counter}
              />
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Gallery</h2>
              <ImageGallery photos={photos} theme={theme} counter={counter} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <Card
            className="max-w-lg w-[90%] max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">Details</h3>
              <pre className="text-xs overflow-auto bg-muted/50 p-3 rounded max-h-[400px]">
                {JSON.stringify(modalContent, null, 2)}
              </pre>
              <Button className="mt-3" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
