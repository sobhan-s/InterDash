import React, { Suspense, useContext } from "react";
import { AppContext } from "@/core/AppContext";

const Footer = React.lazy(() => import("../components/Footer"));

export default function FooterWrapper() {
  const { theme, counter, notifications } = useContext(AppContext);

  return (
    <Suspense fallback={null}>
      <Footer theme={theme} counter={counter} notifications={notifications} />
    </Suspense>
  );
}
