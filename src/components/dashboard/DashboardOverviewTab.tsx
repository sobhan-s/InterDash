import React from 'react';
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
  counter,
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
  return (
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
        <WeatherWidget theme={theme} counter={counter} data={weatherData} onCityClick={onOpenModal} />
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
          comments={_.groupBy(comments, 'postId')}
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

      <ThreeScene counter={counter} theme={theme} />
      <D3Visualization data={posts} counter={counter} theme={theme} />
      <MathPlayground counter={counter} theme={theme} />
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

      <DraggableList />
      <VirtualizedFeed items={posts} counter={counter} />

      <CustomTabPanel
        title="Quick Stats"
        tabs={[
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
        ]}
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

export default DashboardOverviewTab;
