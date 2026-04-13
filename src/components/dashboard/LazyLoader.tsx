import { Suspense, useEffect, useRef, useState } from "react";

export const LazyScrollWrapper = ({ children, height = 400 }: { children: React.ReactNode; height?: number }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: isInView ? undefined : height }}>
      {isInView ? (
        <Suspense fallback={<div className="flex items-center justify-center text-muted-foreground border rounded bg-muted/20 animate-pulse" style={{ minHeight: height }}>Loading module...</div>}>
          {children}
        </Suspense>
      ) : null}
    </div>
  );
};