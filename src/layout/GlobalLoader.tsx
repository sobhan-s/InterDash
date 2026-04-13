import React, { useContext } from "react";
import { AppContext } from "@/core/AppContext";
 
export default function GlobalLoader() {
  const { isLoading } = useContext(AppContext);
 
  if (!isLoading) return null;
 
  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 bg-white dark:bg-gray-800 px-6 py-4 rounded-lg shadow-lg">
        
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
 
        <span className="text-sm font-medium">Loading...</span>
      </div>
    </div>
  );
}
 