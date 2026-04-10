import React, { memo, useCallback, useMemo } from 'react';
import _ from 'lodash';
import CryptoTracker from '../CryptoTracker';
import WeatherWidget from '../WeatherWidget';
import UserList from '../UserList';
import PostsFeed from '../PostsFeed';
import TodoList from '../TodoList';
import DataChart from '../DataChart';
import ImageGallery from '../ImageGallery';
import MarkdownEditor from '../MarkdownEditor';
import Analytics from '../Analytics';
import SearchFilter from '../SearchFilter';
import ThreeScene from '../ThreeScene';
import ReportGenerator from '../ReportGenerator';
import D3Visualization from '../D3Visualization';
import MathPlayground from '../MathPlayground';
import DraggableList from '../DraggableList';
import CustomTabPanel from '../CustomTabPanel';
import VirtualizedFeed from '../VirtualizedFeed';
import DashboardProfileForm from './DashboardProfileForm';

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
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">Overview - Last updated: {lastUpdated}</h2>

      <div className="loading-shimmer h-1 w-full mb-1 rounded" />

      <div className="grid grid-cols-2 gap-5" style={{ width: '1100px', minWidth: '1100px' }}>
        <CryptoTracker
          theme={theme}
          data={cryptoData}
          onSelect={onSelectItem}
        />
        <WeatherWidget theme={theme} data={weatherData} onCityClick={onOpenModal} />
        <UserList
          theme={theme}
          users={users}
          posts={posts}
          globalSearchQuery={globalSearchQuery}
          onUserClick={onOpenModal}
        />
        <PostsFeed
          theme={theme}
          posts={getSortedAndFilteredPosts()}
          comments={groupedComments}
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
  );
};

export default memo(DashboardOverviewTab);
