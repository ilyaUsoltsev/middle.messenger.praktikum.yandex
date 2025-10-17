import { METHODS } from "./constants";
import type { METHOD, RequestOptions } from "./types";

export default class HttpClient<T extends string | number | boolean> {
  get = this.createMethod(METHODS.GET);

  post = this.createMethod(METHODS.POST);

  put = this.createMethod(METHODS.PUT);

  delete = this.createMethod(METHODS.DELETE);

  private createMethod(method: METHOD) {
    return (url: string, options: Omit<RequestOptions<T>, "method">) => {
      return this.request(url, { ...options, method });
    };
  }

  private createQueryString(data: Record<string, T>): string {
    const query = Object.entries(data)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    return query ? `?${query}` : "";
  }

  private request = (url: string, options: RequestOptions<T>) => {
    const { method, data, headers, timeout = 5000 } = options;

    return new Promise((resolve, reject) => {
      let query: string = url;

      if (method === METHODS.GET && data) {
        query += this.createQueryString(data);
      }

      const xhr = new XMLHttpRequest();
      xhr.timeout = timeout;
      xhr.open(method, query);

      if (headers) {
        for (const key in headers) {
          xhr.setRequestHeader(key, headers[key]);
        }
      }

      xhr.onload = function () {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      if (method === METHODS.GET) {
        xhr.send();
      } else {
        xhr.setRequestHeader("Content-Type", "application/json");
        const payload = JSON.stringify(data ?? {});
        xhr.send(payload);
      }
    });
  };
}
