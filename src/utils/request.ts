import Taro from "@tarojs/taro";
import config from "@/config";
// 常量定义
const DEFAULT_TIMEOUT = 60000; // 默认超时时间 60s
const LOADING_TEXT = "加载中...";
const ERROR_MESSAGE = {
  NETWORK: "网络异常",
  TIMEOUT: "请求超时",
  DEFAULT: "请求失败",
};

// 错误类型定义
interface RequestError extends Error {
  code?: number;
  statusCode?: number;
}

// 请求配置接口
interface RequestOptions<T = any> {
  url: string;
  method?: "GET" | "POST";
  data?: T;
  header?: Record<string, string>;
  loading?: boolean;
  timeout?: number;
  retry?: number; // 重试次数
}

// 响应数据接口
interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
  status: number;
}

// 拦截器接口
interface Interceptor {
  request?: (config: RequestOptions) => RequestOptions;
  response?: (response: any) => any;
  error?: (error: RequestError) => any;
}

export class Request {
  private baseUrl: string;
  private defaultHeader: Record<string, string>;
  private interceptors: Interceptor[] = [];
  // private eventManager: RequestEventManager;

  constructor(
    baseUrl = config.api.baseUrl,
    defaultHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ` + Taro.getStorageSync("token"),
    }
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeader = defaultHeader;
  }

  // 添加拦截器
  public use(interceptor: Interceptor) {
    this.interceptors.push(interceptor);
  }

  private handleError(error: any): never {
    if (error instanceof Error) {
      throw error;
    }

    if (typeof error === "string") {
      Taro.showToast({
        title: error,
        mask: true,
        icon: "error",
        duration: 3000,
      });
    } else if (typeof error === "object") {
      // Handle object errors
      const errorMessage =
        error?.data?.message || error?.message || ERROR_MESSAGE.DEFAULT;
      Taro.showToast({
        title: errorMessage,
        mask: true,
        icon: "error",
        duration: 3000,
      });
    }

    // Create a more informative error message
    const errorMsg =
      typeof error === "object"
        ? error?.data?.message || error?.message || JSON.stringify(error)
        : error || ERROR_MESSAGE.DEFAULT;

    throw new Error(errorMsg);
  }

  private createTimeout(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(ERROR_MESSAGE.TIMEOUT));
      }, timeout);
    });
  }

  private handleResponse<T>(
    response: Taro.request.SuccessCallbackResult<ResponseData<T>>
  ): T {
    const result = response.data;

    if (response.statusCode === 201 || response.statusCode === 200) {
      if (result.code === 200) {
        return result.data;
      } else {
        return this.handleError(response);
      }
    }
    return this.handleError(response);
  }

  public async request<T = any, D = any>(
    options: RequestOptions<D>
  ): Promise<T> {
    const {
      url,
      method = "GET",
      data,
      header = {},
      loading = true,
      timeout = DEFAULT_TIMEOUT,
    } = options;

    // if (loading) {
    //   this.showLoading();
    // }

    try {
      const requestPromise = Taro.request<ResponseData<T>>({
        url: `${this.baseUrl}${url}`,
        method,
        data,
        header: {
          ...this.defaultHeader,
          ...header,
        },
      });

      const response = await Promise.race([
        requestPromise,
        this.createTimeout(timeout),
      ]);

      // if (loading) {
      //   this.hideLoading();
      // }

      // 处理 401 未授权的情况
      if (response.statusCode === 401) {
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      // if (loading) {
      //   this.hideLoading();
      // }
      return this.handleError(error);
    }
  }

  public get<T = any, D = any>(
    url: string,
    data?: D,
    header?: Record<string, string>
  ) {
    return this.request<T, D>({
      url,
      method: "GET",
      data,
      header,
    });
  }

  public post<T = any, D = any>(
    url: string,
    data?: D,
    header?: Record<string, string>
  ) {
    return this.request<T, D>({
      url,
      method: "POST",
      data,
      header,
    });
  }
}

export const request = new Request();
