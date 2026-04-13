import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "@/core/AppContext";

export default function Sidebar() {
  const { theme, sidebarOpen, counter, routeHistory } = useContext(AppContext);

  if (!sidebarOpen) return null;

  return (
    <div
      className={`p-5 min-h-[calc(100vh-60px)] border-r flex-shrink-0 ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
      style={{ width: "clamp(0px, 20vw, 250px)" }}
    >
      <h3 className="font-semibold mb-3">Navigation</h3>

      <p className="text-xs text-muted-foreground mb-4">
        Uptime: {counter}s
      </p>

      
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
        <p className="font-semibold">
          Route History ({routeHistory.length}):
        </p>

        {routeHistory.map((r: string, i: number) => (
          <div key={i}>{r}</div>
        ))}
      </div>
    </div>
  );
}
