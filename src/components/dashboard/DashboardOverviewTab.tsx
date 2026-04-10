import React, { memo, useCallback, useMemo } from 'react';
import _ from 'lodash';
import CryptoTracker from '../CryptoTracker';
import WeatherWidget from '../WeatherWidget';
import UserList from '../UserList';
import PostsFeed from '../PostsFeed';
import TodoList from '../TodoList';
import DraggableList from '../DraggableList';
import CustomTabPanel from '../CustomTabPanel';
import VirtualizedFeed from '../VirtualizedFeed';
import DashboardProfileForm from './DashboardProfileForm';

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

const DashboardOverviewTab = ({
  theme,
  globalSearchQuery,
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
  const groupedComments = useMemo(() => _.groupBy(comments, 'postId'), [comments]);
  const searchableData = useMemo(() => [...posts, ...users, ...todos], [posts, users, todos]);
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
        content: <p className="text-sm text-muted-foreground">Total comments: {comments.length}</p>,
      },
    ],
    [posts.length, users.length, todos.length, comments.length],
  );

  const handleFilterResults = useCallback((result: unknown[]) => {
    console.log('filtered:', result.length);
  }, []);

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

        <div className="loading-shimmer h-1 w-full mb-1 rounded" />

        <div className="grid grid-cols-2 gap-5" style={{ width: '1100px', minWidth: '1100px' }}>
          <CryptoTracker
            theme={theme}
            counter={counter}
            data={cryptoData}
            onSelect={onSelectItem}
          />
          <WeatherWidget
            theme={theme}
            counter={counter}
            data={weatherData}
            onCityClick={onOpenModal}
          />
          <UserList
            theme={theme}
            counter={counter}
            users={users}
            posts={posts}
            globalSearchQuery={globalSearchQuery}
            onUserClick={onOpenModal}
          />
          <PostsFeed
            theme={theme}
            counter={counter}
            posts={getSortedAndFilteredPosts()}
            comments={groupBy(comments, 'postId')}
            onPostClick={onOpenModal}
          />
        </div>

        <TodoList
          todos={todos}
          onAdd={onAddTodo}
          onDelete={onDeleteTodo}
          onToggle={onToggleTodo}
          onEdit={onEditTodo}
          theme={theme}
          data={cryptoData}
          onSelect={onSelectItem}
        />
        <WeatherWidget theme={theme} data={weatherData} onCityClick={onOpenModal} />
        <UserList
          theme={theme}
          users={users}
          posts={posts}
          users={users}
          todos={todos}
          comments={comments}
          theme={theme}
          posts={getSortedAndFilteredPosts()}
          comments={groupedComments}
          onPostClick={onOpenModal}
        />

      <TodoList
        todos={todos}
        onAdd={onAddTodo}
        onDelete={onDeleteTodo}
        onToggle={onToggleTodo}
        onEdit={onEditTodo}
        theme={theme}
      />

      <DataChart
        posts={posts}
        users={users}
        todos={todos}
        comments={comments}
        theme={theme}
      />

      <ThreeScene theme={theme} />
      <D3Visualization data={posts} theme={theme} />
      <MathPlayground theme={theme} />
      <ReportGenerator posts={posts} users={users} theme={theme} />
      <ImageGallery photos={photos} theme={theme} />
      <MarkdownEditor theme={theme} />

      <Analytics
        posts={posts}
        users={users}
        todos={todos}
        comments={comments}
        albums={albums}
        photos={photos}
        theme={theme}
      />

      <SearchFilter
        data={searchableData}
        onFilter={handleFilterResults}
        theme={theme}
      />

      <DraggableList />
      <VirtualizedFeed items={posts} />

      <CustomTabPanel
        title="Quick Stats"
        tabs={quickStatsTabs}
      />

        <DashboardProfileForm
          formData={formData}
          validationErrors={validationErrors}
          onFieldChange={onProfileFieldChange}
          onSave={onProfileSave}
        />
      </div>
    </Suspense>
  );
};

export default memo(DashboardOverviewTab);
