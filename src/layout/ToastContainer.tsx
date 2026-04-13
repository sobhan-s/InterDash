import React, { useContext } from "react";
import { AppContext } from "@/core/AppContext";

export default function ToastContainer() {
  const { toasts, setToasts } = useContext(AppContext);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-[9999]">
      {toasts.map((toast: any) => (
        <div key={toast.id}>
          {toast.message}
          <button onClick={() => setToasts((p:any)=>p.filter((t:any)=>t.id!==toast.id))}>×</button>
        </div>
      ))}
    </div>
  );
}
