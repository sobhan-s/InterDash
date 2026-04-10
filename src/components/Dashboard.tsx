import React, { memo, useContext, useState } from 'react';
import { RefreshCw, LayoutDashboard, FileText, CheckSquare, Image, Loader2 } from 'lucide-react';
import { AppContext } from '../App';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import DashboardModal from './dashboard/DashboardModal';
import DashboardOverviewTab from './dashboard/DashboardOverviewTab';
import DashboardPostsTab from './dashboard/DashboardPostsTab';
import { type DashboardProps } from '../lib/types';
import { useDashboardData } from './dashboard/useDashboardData';
import { useDashboardState } from './dashboard/useDashboardState';
import TodoList from './TodoList';
import ImageGallery from './ImageGallery';

const Dashboard = ({ theme, globalSearchQuery }: DashboardProps) => {
  const { addToast } = useContext(AppContext);
  const [refreshCount, setRefreshCount] = useState(0);

  const {
    cryptoData,
    weatherData,
    users,
    posts,
    todos,
    comments,
    albums,
    photos,
    loading,
    error,
    lastUpdated,
    setTodos,
  } = useDashboardData({
    theme,
    refreshCount,
  });

  const {
    activeTab,
    setActiveTab,
    sortOrder,
    setSortOrder,
    filterText,
    setFilterText,
    modalOpen,
    modalContent,
    openModal,
    closeModal,
    page,
    setPage,
    formData,
    validationErrors,
    handleAddTodo,
    handleEditTodo,
    handleDeleteTodo,
    handleToggleTodo,
    handleSelectItem,
    getSortedAndFilteredPosts,
    getPaginatedData,
    totalPages,
    handleFormChange,
    handleProfileSave,
  } = useDashboardState({
    posts,
    todos,
    users,
    comments,
    photos,
    albums,
    setTodos,
    addToast,
  });

  const handleRefresh = () => {
    setRefreshCount((count) => count + 1);
    addToast('Dashboard refreshed', 'success');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold">Loading dashboard...</h2>
        <p className="text-muted-foreground text-sm mt-1">Fetching data from multiple APIs...</p>
      </div>
    );
  }

  if (error) {
  }

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
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
              </Button>
              <Badge variant="secondary" className="text-xs">
                Auto-refresh 1s
              </Badge>
            </div>
          </div>

          <TabsContent value="overview">
            <DashboardOverviewTab
              theme={theme}
              globalSearchQuery={globalSearchQuery}
              lastUpdated={lastUpdated}
              cryptoData={cryptoData}
              weatherData={weatherData}
              users={users}
              posts={posts}
              todos={todos}
              comments={comments}
              albums={albums}
              photos={photos}
              formData={formData}
              validationErrors={validationErrors}
              onSelectItem={handleSelectItem}
              onOpenModal={openModal}
              onAddTodo={handleAddTodo}
              onDeleteTodo={handleDeleteTodo}
              onToggleTodo={handleToggleTodo}
              onEditTodo={handleEditTodo}
              onProfileFieldChange={handleFormChange}
              onProfileSave={handleProfileSave}
              getSortedAndFilteredPosts={getSortedAndFilteredPosts}
            />
          </TabsContent>

          <TabsContent value="posts">
            <DashboardPostsTab
              filterText={filterText}
              onFilterTextChange={setFilterText}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              page={page}
              onPageChange={setPage}
              getPaginatedData={getPaginatedData}
              totalPages={totalPages}
              getSortedAndFilteredPosts={getSortedAndFilteredPosts}
            />
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
              />
            </div>
          </TabsContent>

          <TabsContent value="gallery">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Gallery</h2>
              <ImageGallery photos={photos} theme={theme} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <DashboardModal open={modalOpen} content={modalContent} onClose={closeModal} />
    </div>
  );
};

export default memo(Dashboard);
