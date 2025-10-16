import { METHODS } from "./constants";
import type { RequestOptions } from "./types";

export default class HttpClient {
  get = (url: string, options: Omit<RequestOptions, "method">) => {
    return this.request(url, { ...options, method: METHODS.GET }, options.timeout);
  };

  post = (url: string, options: Omit<RequestOptions, "method">) => {
    return this.request(url, { ...options, method: METHODS.POST }, options.timeout);
  };

  put = (url: string, options: Omit<RequestOptions, "method">) => {
    return this.request(url, { ...options, method: METHODS.PUT }, options.timeout);
  };

  delete = (url: string, options: Omit<RequestOptions, "method">) => {
    return this.request(url, { ...options, method: METHODS.DELETE }, options.timeout);
  };

  private request = (url: string, options: RequestOptions, timeout = 5000) => {
    const { method, data, headers } = options;

    return new Promise((resolve, reject) => {
      const timerID = setTimeout(reject, timeout);
      let query: string = url;
      if (method === METHODS.GET && data) {
        query += "?";
        for (const key in data) {
          query += `${key}=${data[key]}&`;
        }
        query = query.slice(0, query.length - 1);
      }
      const xhr = new XMLHttpRequest();
      xhr.open(method, query);
      if (headers) {
        for (const key in headers) {
          xhr.setRequestHeader(key, headers[key]);
        }
      }

      xhr.onload = function () {
        clearTimeout(timerID);
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
