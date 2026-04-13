import React, { Suspense, useContext, useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { AppContext } from "@/core/AppContext";
import NotFound from "../components/NotFound";
import GlobalLoader from "@/layout/GlobalLoader";

const Dashboard = React.lazy(() => import("../components/Dashboard"));
const CryptoTracker = React.lazy(() => import("../components/CryptoTracker"));
const WeatherWidget = React.lazy(() => import("../components/WeatherWidget"));
const UserList = React.lazy(() => import("../components/UserList"));
const PostsFeed = React.lazy(() => import("../components/PostsFeed"));
const TodoList = React.lazy(() => import("../components/TodoList"));
const DataChart = React.lazy(() => import("../components/DataChart"));
const ImageGallery = React.lazy(() => import("../components/ImageGallery"));
const MarkdownEditor = React.lazy(() => import("../components/MarkdownEditor"));
const Analytics = React.lazy(() => import("../components/Analytics"));
const SearchFilter = React.lazy(() => import("../components/SearchFilter"));
const ThreeScene = React.lazy(() => import("../components/ThreeScene"));
const ReportGenerator = React.lazy(() => import("../components/ReportGenerator"));
const D3Visualization = React.lazy(() => import("../components/D3Visualization"));
const MathPlayground = React.lazy(() => import("../components/MathPlayground"));

export const AppRoutes = () => {
  const {
    theme,
    user,
    notifications,
    sidebarOpen,
    appData,
    setAppData,
    posts,
    users,
    todos,
    comments,
    albums,
    photos,
    globalSearchQuery,
  } = useContext(AppContext);

  
  const searchFilterData = useMemo(
    () => [...posts, ...users, ...todos],
    [posts, users, todos]
  );

  
  const onEditPropHandler = () => {};
  const onAddPropHandler = () => {};
  const onDeletePropHandler = () => {};
  const onTogglePropHandler = () => {};

  return (
    <Suspense fallback={<GlobalLoader />}>
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
          element={
            <SearchFilter data={searchFilterData} theme={theme} />
          }
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
  );
};
