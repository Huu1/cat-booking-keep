import { useState, useEffect, useRef, useCallback, DependencyList } from "react";

type Options<TParams extends any[], TData> = {
  manual?: boolean; // 是否手动触发
  defaultParams?: TParams; // 默认参数
  retryCount?: number; // 自动重试次数
  retryInterval?: number; // 重试间隔(ms)
  refreshDeps?: DependencyList, // 新增 refreshDeps 类型

  onSuccess?: (data: TData) => void; // 成功回调
  onError?: (error: Error) => void; // 失败回调
}

const useRequest = <TData = any, TParams extends any[] = any[]>(
  asyncFn: (...args: TParams) => Promise<TData>,
  options: Options<TParams, TData> = {}
) => {
  const {
    manual = false,
    defaultParams = [] as unknown as TParams,
    retryCount = 0,
    retryInterval = 1000,
    onSuccess,
    onError,
    refreshDeps
  } = options;

  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);
  const timerRef = useRef<NodeJS.Timeout>();

  // 组件卸载清理
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 核心执行方法
  const run = useCallback(
    async (...params: TParams) => {
      if (!mountedRef.current) return;

      try {
        setLoading(true);
        setError(null);

        const result = await asyncFn(...params);

        if (mountedRef.current) {
          setData(result);
          retryCountRef.current = 0;
          onSuccess?.(result);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err as Error);
          onError?.(err as Error);

          // 自动重试逻辑
          if (retryCount > 0 && retryCountRef.current < retryCount) {
            retryCountRef.current += 1;
            timerRef.current = setTimeout(() => {
              run(...params);
            }, retryInterval);
          }
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [asyncFn, onSuccess, onError, retryCount, retryInterval]
  );

  // 自动执行
  useEffect(() => {
    if (!manual) {
      run(...defaultParams);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!manual && refreshDeps) {
      run(...defaultParams)
    }
  }, refreshDeps || []) // 监听 refreshDeps 变化

  // 强制刷新（使用上次参数重新请求）
  const refresh = useCallback(() => {
    run(...defaultParams);
  }, [run, defaultParams]);

  return {
    data, // 响应数据
    loading, // 加载状态
    error, // 错误对象
    run, // 手动触发方法
    refresh, // 重新执行上次请求
  };
};

export default useRequest;
