import React, { Suspense, useEffect, useRef, useState, useCallback, useMemo, useContext } from 'react';


const WeatherWidget=React.lazy(()=>import('../WeatherWidget'));
const UserList=React.lazy(()=>import('../UserList'));
const PostsFeed=React.lazy(()=>import('../PostsFeed'));
const TodoList=React.lazy(()=>import('../TodoList'));
const DraggableList=React.lazy(()=>import('../DraggableList'));
const CustomTabPanel=React.lazy(()=>import('../CustomTabPanel'));
const VirtualizedFeed=React.lazy(()=>import('../VirtualizedFeed'));
const DashboardProfileForm=React.lazy(()=>import('./DashboardProfileForm'));
const CryptoTracker = React.lazy(() => import('../CryptoTracker'));
const DataChart = React.lazy(() => import('../DataChart'));
const ImageGallery = React.lazy(() => import('../ImageGallery'));
const MarkdownEditor = React.lazy(() => import('../MarkdownEditor'));
const Analytics = React.lazy(() => import('../Analytics'));
const SearchFilter = React.lazy(() => import('../SearchFilter'));
const ThreeScene = React.lazy(() => import('../ThreeScene'));
const ReportGenerator = React.lazy(() => import('../ReportGenerator'));
const D3Visualization = React.lazy(() => import('../D3Visualization'));
const MathPlayground = React.lazy(() => import('../MathPlayground'));

import { DashboardOverviewTabProps } from '../../lib/types';
import { AppContext } from '@/App';

const DashboardOverviewTab = React.memo(({
  lastUpdated,
  cryptoData,
  weatherData,
  users,
  posts,
  todos,
  comments,
  albums,
  photos,
  formData,
  validationErrors,
  onSelectItem,
  onOpenModal,
  onAddTodo,
  onDeleteTodo,
  onToggleTodo,
  onEditTodo,
  onProfileFieldChange,
  onProfileSave,
  getSortedAndFilteredPosts,
}: DashboardOverviewTabProps) => {
  const { theme,  globalSearchQuery } = useContext(AppContext);
  const shimmerRef = useRef<HTMLDivElement | null>(null);
  const [isShimmerInView, setIsShimmerInView] = useState(true);

  useEffect(() => {
    const shimmerElement = shimmerRef.current;
    if (!shimmerElement || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsShimmerInView(entry.isIntersecting);
      },
      { threshold: 0.01 },
    );

    observer.observe(shimmerElement);

    return () => {
      observer.disconnect();
    };
  }, []);


  const commentsByPostId = useMemo(() => comments.reduce((acc, c) => {
    (acc[c.postId] ??= []).push(c);
    return acc;
  }, {} as Record<string, typeof comments>), [comments]);

  const sortedAndFilteredPosts = useMemo(
    () => getSortedAndFilteredPosts(),
    [getSortedAndFilteredPosts],
  );


  const searchFilterData = useMemo(
    () => [...posts, ...users, ...todos],
    [posts, users, todos],
  );


  const handleSelectItem = useCallback(
    (...args: Parameters<typeof onSelectItem>) => onSelectItem(...args),
    [onSelectItem],
  );

  const handleOpenModal = useCallback(
    (...args: Parameters<typeof onOpenModal>) => onOpenModal(...args),
    [onOpenModal],
  );

  const handleAddTodo = useCallback(
    (...args: Parameters<typeof onAddTodo>) => onAddTodo(...args),
    [onAddTodo],
  );

  const handleDeleteTodo = useCallback(
    (...args: Parameters<typeof onDeleteTodo>) => onDeleteTodo(...args),
    [onDeleteTodo],
  );

  const handleToggleTodo = useCallback(
    (...args: Parameters<typeof onToggleTodo>) => onToggleTodo(...args),
    [onToggleTodo],
  );

  const handleEditTodo = useCallback(
    (...args: Parameters<typeof onEditTodo>) => onEditTodo(...args),
    [onEditTodo],
  );

  const handleProfileFieldChange = useCallback(
    (...args: Parameters<typeof onProfileFieldChange>) => onProfileFieldChange(...args),
    [onProfileFieldChange],
  );

  const handleProfileSave = useCallback(
    (...args: Parameters<typeof onProfileSave>) => onProfileSave(...args),
    [onProfileSave],
  );


  const quickStatsTabs = useMemo(
    () => [
      {
        label: 'Posts',
        content: <p className="text-sm text-muted-foreground">Total posts: {posts.length}</p>,
      },
      {
        label: 'Users',
        content: <p className="text-sm text-muted-foreground">Total users: {users.length}</p>,
      },
      {
        label: 'Todos',
        content: <p className="text-sm text-muted-foreground">Total todos: {todos.length}</p>,
      },
      {
        label: 'Comments',
        content: (
          <p className="text-sm text-muted-foreground">Total comments: {comments.length}</p>
        ),
      },
    ],
    [posts.length, users.length, todos.length, comments.length],
  );



  return (
    <Suspense
      fallback={
        <div className="h-96 flex items-center justify-center text-muted-foreground border rounded bg-muted/20 animate-pulse">
          Loading dashboard analytical modules...
        </div>
      }
    >
      <div className="space-y-5">
        <h2 className="text-lg font-semibold">Overview - Last updated: {lastUpdated}</h2>

        <div
          ref={shimmerRef}
          className={`loading-shimmer h-1 w-full mb-1 rounded ${isShimmerInView ? 'shimmer-running' : 'shimmer-paused'}`}
        />

        <div className="grid grid-cols-2 gap-5" style={{ width: '1100px', minWidth: '1100px' }}>
          <CryptoTracker
            theme={theme}
            data={cryptoData}
            onSelect={handleSelectItem}
          />
          <WeatherWidget
            theme={theme}
            data={weatherData}
            onCityClick={handleOpenModal}
          />
          <UserList
            theme={theme}
            users={users}
            posts={posts}
            globalSearchQuery={globalSearchQuery}
            onUserClick={handleOpenModal}
          />
          <PostsFeed
            theme={theme}
            posts={sortedAndFilteredPosts}
            comments={commentsByPostId}
            onPostClick={handleOpenModal}
          />
        </div>

        <TodoList
          todos={todos}
          onAdd={handleAddTodo}
          onDelete={handleDeleteTodo}
          onToggle={handleToggleTodo}
          onEdit={handleEditTodo}
          theme={theme}
        />

        <DataChart
          posts={posts}
          users={users}
          todos={todos}
          comments={comments}
          theme={theme}
        
        />

        <ThreeScene  theme={theme} />
        <D3Visualization data={posts} theme={theme} />
        <MathPlayground theme={theme} />
        <ReportGenerator posts={posts} users={users} theme={theme} />
        <ImageGallery theme={theme}  />
        <MarkdownEditor theme={theme}  />

        <Analytics
          posts={posts}
          users={users}
          todos={todos}
          comments={comments}
          albums={albums}
          photos={photos}
          theme={theme}
        />

        <SearchFilter data={searchFilterData} theme={theme}  />

        <DraggableList />
        <VirtualizedFeed items={posts}  />

        <CustomTabPanel
          title="Quick Stats"
          tabs={quickStatsTabs}
        />

        <DashboardProfileForm
          formData={formData}
          validationErrors={validationErrors}
          onFieldChange={handleProfileFieldChange}
          onSave={handleProfileSave}
        />
      </div>
    </Suspense>
  );
});

DashboardOverviewTab.displayName = 'DashboardOverviewTab';

export default DashboardOverviewTab;

