import { useState, useEffect, useRef, useCallback, DependencyList } from "react";
import { debounce } from 'lodash';

type Service<TData, TParams extends any[]> = (...args: TParams) => Promise<TData>;

interface Options<TData, TParams extends any[]> {
  manual?: boolean;
  defaultParams?: TParams;
  onSuccess?: (data: TData, params: TParams) => void;
  onError?: (error: Error, params: TParams) => void;

  // 依赖刷新
  refreshDeps?: DependencyList;

  // 错误重试
  retryCount?: number;
  retryInterval?: number;

  // loading延迟
  loadingDelay?: number;

  // 防抖
  debounceWait?: number;
  debounceLeading?: boolean;
  debounceTrailing?: boolean;
  debounceMaxWait?: number;
}

interface Result<TData, TParams extends any[]> {
  data: TData | undefined;
  error: Error | undefined;
  loading: boolean;
  params: TParams | [];
  run: (...params: TParams) => Promise<TData>;
  refresh: () => Promise<TData>;
  cancel: () => void;
}

function useRequest<TData, TParams extends any[] = any[]>(
  service: Service<TData, TParams>,
  options: Options<TData, TParams> = {}
): Result<TData, TParams> {
  const {
    manual = false,
    defaultParams = [] as unknown as TParams,
    onSuccess,
    onError,
    refreshDeps = [],
    retryCount = 0,
    retryInterval = 1000,
    loadingDelay = 0,
    debounceWait = 0,
    debounceLeading = false,
    debounceTrailing = true,
    debounceMaxWait,
  } = options;

  const [data, setData] = useState<TData>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<TParams | []>([] as unknown as TParams);

  const mountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const loadingDelayTimerRef = useRef<NodeJS.Timeout>();
  const cancelRef = useRef<() => void>(() => {});
  const isFirstRender = useRef(true); // 添加这一行

  // 清理函数
  const cleanup = () => {
    if (loadingDelayTimerRef.current) {
      clearTimeout(loadingDelayTimerRef.current);
    }
    cancelRef.current();
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, []);

  // 核心请求函数
  const runService = useCallback(async (serviceParams: TParams): Promise<TData> => {
    cleanup();
    setParams(serviceParams);

    // 处理loading延迟
    if (loadingDelay > 0) {
      loadingDelayTimerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setLoading(true);
        }
      }, loadingDelay);
    } else {
      setLoading(true);
    }

    try {
      const result = await service(...serviceParams);
      if (mountedRef.current) {
        setData(result);
        setError(undefined);
        onSuccess?.(result, serviceParams);
      }
      return result;
    } catch (err) {
      const error = err as Error;
      if (mountedRef.current) {
        setError(error);
        onError?.(error, serviceParams);

        // 错误重试逻辑
        if (retryCount > 0 && retryCountRef.current < retryCount) {
          retryCountRef.current += 1;
          const retryPromise = new Promise<TData>((resolve) => {
            setTimeout(() => {
              if (mountedRef.current) {
                runService(serviceParams).then(resolve);
              }
            }, retryInterval);
          });
          return retryPromise;
        }
      }
      throw error;
    } finally {
      if (mountedRef.current) {
        if (loadingDelayTimerRef.current) {
          clearTimeout(loadingDelayTimerRef.current);
        }
        setLoading(false);
        retryCountRef.current = 0;
      }
    }
  }, [service, onSuccess, onError, loadingDelay, retryCount, retryInterval]);

  // 创建防抖版本的runService
  const debouncedRunService = useCallback(
    // @ts-ignore
    debounceWait > 0
      ? debounce(
          (serviceParams: TParams, resolve: (value: TData | PromiseLike<TData>) => void, reject: (reason?: any) => void) => {
            runService(serviceParams)
              .then(resolve)
              .catch(reject);
          },
          debounceWait,
          {
            leading: debounceLeading,
            trailing: debounceTrailing,
            maxWait: debounceMaxWait,
          }
        )
      : undefined,
    [runService, debounceWait, debounceLeading, debounceTrailing, debounceMaxWait]
  );

  // 对外暴露的run方法
  const run = useCallback(
    (...args: TParams): Promise<TData> => {
      if (debounceWait > 0 && debouncedRunService) {
        return new Promise<TData>((resolve, reject) => {
          debouncedRunService(args, resolve, reject);

          // 提供取消功能
          cancelRef.current = () => {
            // @ts-ignore
            debouncedRunService.cancel();
            reject(new Error('Request canceled'));
          };
        });
      }

      return runService(args);
    },
    [runService, debouncedRunService, debounceWait]
  );

  // 刷新方法 - 使用上一次的参数
  const refresh = useCallback((): Promise<TData> => {
    return run(...(params as TParams));
  }, [run, params]);

  // 取消方法
  const cancel = useCallback(() => {
    cancelRef.current();
  }, []);

  // 自动执行
  useEffect(() => {
    if (!manual) {
      run(...defaultParams);
    }
  }, [manual]); // eslint-disable-line react-hooks/exhaustive-deps

  // 依赖刷新
  useEffect(() => {
    if (!manual && refreshDeps.length > 0) {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      run(...defaultParams);
    }
  }, [...refreshDeps]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    error,
    loading,
    params: params as TParams | [],
    run,
    refresh,
    cancel,
  };
}

export default useRequest;
