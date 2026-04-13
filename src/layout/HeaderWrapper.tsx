import React, { Suspense, useContext } from "react";
import { AppContext } from "@/core/AppContext";

const Header = React.lazy(() => import("../components/Header"));

export default function HeaderWrapper() {
  const ctx = useContext(AppContext);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header
        theme={ctx.theme}
        onThemeToggle={ctx.handleThemeToggle} 
        user={ctx.user}
        setUser={ctx.setUser}
        notifications={ctx.notifications}
        sidebarOpen={ctx.sidebarOpen}
        setSidebarOpen={ctx.setSidebarOpen}
        globalSearchQuery={ctx.globalSearchQuery}
        setGlobalSearchQuery={ctx.setGlobalSearchQuery}
        counter={ctx.counter}
      />
    </Suspense>
  );
}






