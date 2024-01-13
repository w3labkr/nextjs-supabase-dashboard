'use client';

import { useState, useEffect, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import _debounce from 'lodash/debounce';

const fetcher = (url) => fetch(url).then((res) => res.json());

function useInfiniteScroll({
  fetchUrl = '',
  fetchSize = 10,
  fetchInitialSize = 1,
  fetchOptions = {},
  debounceWait = 100,
  debounceOptions = {},
  intersectionObserveThresholds = 0,
  intersectionObserveOptions = {},
}) {
  const getKey = useCallback(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.length) return null;
      if (pageIndex === 0) return `${fetchUrl}?page=1&per_page=${fetchSize}`;
      return `${fetchUrl}?page=${pageIndex + 1}&per_page=${fetchSize}`;
    },
    [fetchUrl, fetchSize]
  );
  const res = useSWRInfinite(getKey, fetcher, {
    initialSize: fetchInitialSize,
    revalidateFirstPage: false,
    ...fetchOptions,
  });

  const { data: raw, error, isLoading, isValidating, mutate, size, setSize } = res;
  const [data, setData] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isReachingEnd, setIsReachingEnd] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setData(raw ? [].concat(...raw) : []);
  }, [raw]);

  useEffect(() => {
    setIsLoadingMore(isLoading || (size > 0 && raw && typeof raw[size - 1] === 'undefined'));
  }, [raw, isLoading, size]);

  useEffect(() => {
    setIsEmpty(raw?.[0]?.length === 0);
  }, [raw]);

  useEffect(() => {
    setIsReachingEnd(isEmpty || (raw && raw[raw.length - 1]?.length < fetchSize));
  }, [raw, isEmpty, fetchSize]);

  useEffect(() => {
    setIsRefreshing(isValidating && raw && raw.length === size);
  }, [raw, isValidating, size]);

  const callback = (entry, observer) => {
    if (entry.isIntersecting && !isReachingEnd && !isLoadingMore) {
      setSize((prev) => prev + 1);
    }
  };
  const debouncedCallback = _debounce(callback, debounceWait, debounceOptions);
  const { ref } = useIntersectionObserver(debouncedCallback, {
    thresholds: intersectionObserveThresholds,
    ...intersectionObserveOptions,
  });

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    size,
    setSize,
    isLoadingMore,
    isEmpty,
    isReachingEnd,
    isRefreshing,
    ref,
  };
}

export default useInfiniteScroll;
