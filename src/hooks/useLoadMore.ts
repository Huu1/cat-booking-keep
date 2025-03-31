import { useState, useRef } from "react";
import Taro from "@tarojs/taro";

interface Pagination {
  totalPages: number;
}

interface PaginationData<T> {
  pagination: Pagination;
  details: T[];
}

interface UseLoadMoreOptions<T> {
  pageSize?: number;
  ready?: boolean; // 添加ready参数
  fetchData: (page: number, pageSize: number) => Promise<PaginationData<T>>;
  onRefreshExtra?: () => Promise<void>;
}

interface UseLoadMoreResult<T> {
  list: T[];
  loading: boolean;
  hasMore: boolean;
  refreshing: boolean;
  handleRefresh: () => Promise<void>;
  handleLoadMore: () => Promise<void>;
  reset: () => Promise<void>;
  initLoad: () => Promise<void>;
}

export function useLoadMore<T>({
  pageSize = 10,
  ready = true, // 设置默认值为true
  fetchData,
  onRefreshExtra,
}: UseLoadMoreOptions<T>): UseLoadMoreResult<T> {
  // 状态定义
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [list, setList] = useState<T[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const requestLock = useRef(false);

  // 处理分页数据的公共函数
  const handlePaginationData = (data: PaginationData<T>, currentPage: number) => {
    const { pagination, details } = data;

    if (pagination) {
      const totalPages = pagination.totalPages || 1;
      setTotalPages(totalPages);
      setHasMore(currentPage < totalPages);
    }

    return details || [];
  };

  // 执行额外的刷新操作
  const executeRefreshExtra = async () => {
    if (onRefreshExtra) {
      await onRefreshExtra();
    }
  };

  // 处理错误的公共函数
  const handleError = (error: any, errorMessage: string) => {
    console.error(errorMessage, error);
    if (errorMessage !== "重置失败:") {
      Taro.showToast({
        title: errorMessage.replace(":", ""),
        icon: "error",
        duration: 1500,
      });
    }
  };

  // 处理下拉刷新
  const handleRefresh = async () => {
    if (!ready || loading || requestLock.current) return; // 添加ready检查

    requestLock.current = true;
    setRefreshing(true);

    try {
      setPage(1);
      setHasMore(true);

      await executeRefreshExtra();

      const firstPageData = await fetchData(1, pageSize);
      if (firstPageData) {
        const details = handlePaginationData(firstPageData, 1);
        setList(details);
      }

      setIsInitialized(true);
    } catch (error) {
      handleError(error, "刷新失败:");
    } finally {
      setRefreshing(false);
      requestLock.current = false;
    }
  };

  // 初始化加载数据（不显示刷新动画）
  const initLoad = async () => {
    if (!ready || isInitialized || loading || requestLock.current) return; // 添加ready检查

    requestLock.current = true;
    setLoading(true);

    try {
      await executeRefreshExtra();

      const firstPageData = await fetchData(1, pageSize);
      if (firstPageData) {
        const details = handlePaginationData(firstPageData, 1);
        setList(details);
      }

      setIsInitialized(true);
    } catch (error) {
      handleError(error, "加载失败:");
    } finally {
      setLoading(false);
      requestLock.current = false;
    }
  };

  // 处理上拉加载更多
  const handleLoadMore = async () => {
    if (!ready || !hasMore || loading || requestLock.current) return; // 添加ready检查

    requestLock.current = true;
    setLoading(true);

    try {
      const nextPage = page + 1;

      if (nextPage > totalPages) {
        setHasMore(false);
        return;
      }

      const nextPageData = await fetchData(nextPage, pageSize);
      if (nextPageData) {
        const { pagination, details } = nextPageData;

        if (pagination) {
          setTotalPages(pagination.totalPages || 1);
          setHasMore(nextPage < pagination.totalPages);
        }

        if (details && details.length > 0) {
          setList((prevList) => [...prevList, ...details]);
        } else {
          setHasMore(false);
        }
      }

      setPage(nextPage);
    } catch (error) {
      handleError(error, "加载更多失败:");
    } finally {
      setLoading(false);
      requestLock.current = false;
    }
  };

  // 重置并重新加载数据
  const reset = async () => {
    if (!ready || requestLock.current) return; // 添加ready检查

    requestLock.current = true;
    setIsInitialized(false);
    setPage(1);
    setHasMore(true);
    setList([]);

    // 添加延迟设置loading的逻辑
    let loadingTimer: NodeJS.Timeout | null = null;
    loadingTimer = setTimeout(() => {
      setLoading(true);
    }, 300);

    try {
      await executeRefreshExtra();

      const firstPageData = await fetchData(1, pageSize);
      if (firstPageData) {
        const details = handlePaginationData(firstPageData, 1);
        setList(details);
      }
    } catch (error) {
      handleError(error, "重置失败:");
    } finally {
      // 清除定时器
      if (loadingTimer) {
        clearTimeout(loadingTimer);
      }
      requestLock.current = false;
      setIsInitialized(true);
      setLoading(false);
    }
  };

  return {
    list,
    loading,
    hasMore,
    refreshing,
    handleRefresh,
    handleLoadMore,
    reset,
    initLoad,
  };
}