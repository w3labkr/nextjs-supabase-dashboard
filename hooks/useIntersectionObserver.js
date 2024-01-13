'use client';

import { useEffect, useRef, useCallback } from 'react';

function useIntersectionObserver(callback, options = {}) {
  const ref = useRef(null);
  const cb = useCallback(
    (entries, observer) => {
      entries.forEach((entry) => callback(entry, observer));
    },
    [callback]
  );

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(cb, options);
    observer.observe(ref.current);
    return () => observer && observer.disconnect();
  }, [ref, cb, options]);

  return { ref };
}

export default useIntersectionObserver;
