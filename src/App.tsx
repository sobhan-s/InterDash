import { BrowserRouter as Router, useLocation } from "react-router-dom";
import GlobalLoader from "./layout/GlobalLoader";
import { AppProvider } from "./core/AppProvider";
import { useContext, useEffect } from "react";
import { useAppEffects } from "./core/useAppEffects";
import ErrorBoundary from "./core/ErrorBoundary";
import HeaderWrapper from "./layout/HeaderWrapper";
import Sidebar from "./layout/Sidebar";
import FooterWrapper from "./layout/FooterWrapper";
import ToastContainer from "./layout/ToastContainer";
import { HiddenInputs } from "./layout/HiddenInputs";
import { AppRoutes } from "./routing/AppRoutes";
import { AppContext } from "./core/AppContext";

const Inner = () => {
  const ctx = useContext(AppContext);
  const location = useLocation();
  useAppEffects(ctx,location);
  useEffect(() => {
  ctx.setIsLoading(true);
 
  const timer = setTimeout(() => {
    ctx.setIsLoading(false);
  }, 400);
 
  return () => clearTimeout(timer);
}, [location.pathname]);

  return (
    <div
      className={`min-h-screen ${
        ctx.theme === "dark"
          ? "dark bg-gray-900 text-white"
          : "bg-white text-gray-900"
      }`}
    >
      <HiddenInputs user={ctx.user} />   
      <HeaderWrapper />
      
      <div className="flex min-w-0 w-full overflow-x-hidden">
        <Sidebar />
        <main className="min-w-0 flex-1 p-5 overflow-auto">
          <AppRoutes />
        </main>

      </div>
      <FooterWrapper />
      <GlobalLoader />
      
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Inner />
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}
