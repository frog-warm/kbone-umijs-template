import {
  addQueryStringToUrl,
  getType,
  convertObjectValueToString,
  urlEncodeFormData,
} from './common';

/**
 * 配置request请求时的默认参数
 */
const request = (url: string, options: RequestOptions) => {
  const { method = 'GET', headers: oHeaders, responseType = 'json' } = options;
  const headers = oHeaders ? convertObjectValueToString(oHeaders) : {};
  let body = options.data;
  if (method === 'GET' || method === 'HEAD') {
    url = addQueryStringToUrl(url, body);
  } else if (typeof body !== 'string' && getType(body) !== 'ArrayBuffer') {
    if (
      headers['content-type'].indexOf('application/x-www-form-urlencoded') > -1
    ) {
      body = urlEncodeFormData(body, true);
    } else if (
      headers['content-type'].indexOf('application/json') > -1 ||
      typeof body === 'object'
    ) {
      body = JSON.stringify(body);
    } else {
      body = body.toString();
    }
  }
  return fetch(url, {
    method: options.method || 'GET',
    headers: headers,
    body,
  }).then((response: Response) => {
    if (response.ok === false) {
      throw response;
    }
    if (responseType === 'arrayBuffer') {
      return response.arrayBuffer();
    }

    if (responseType === 'json') {
      return response.json();
    }

    if (responseType === 'text') {
      return response.text();
    }
    return response;
  });
};

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'HEAD';
  data?: any;
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
  timeout?: number;
  headers?: HeadersInit;
}

interface API {
  request: (url: string, options: RequestOptions) => Promise<any>;
  get: (url: string, options?: RequestOptions) => Promise<any>;
  post: (url: string, options: RequestOptions) => Promise<any>;
}

const jsApi: API = {
  request: (url, options) => request(url, options),
  get: (url, options) => request(url, { responseType: 'json', ...options }),
  post: (url, options) =>
    request(url, { method: 'POST', responseType: 'json', ...options }),
};

const wxApi: API = {
  request: (url, options) =>
    new Promise((resolve, reject) => {
      const callback = (rsp: { statusCode: number; data: any }) => {
        if (rsp.statusCode !== 200) {
          throw rsp;
        }
        if (options.responseType === 'json') {
          return rsp.data;
        }
        return rsp;
      };
      return wx.request({
        ...options,
        responseType:
          options.responseType === 'arrayBuffer' ? 'arraybuffer' : 'text',
        url: `http://blog.tuzuyong.net/cqccn${url}`,
        method: options.method || 'GET',
        success: (rsp: any) => resolve(callback(rsp)),
        fail: (rsp: any) => reject(callback(rsp)),
        complete: (rsp: any) => {
          resolve(callback(rsp));
          reject(callback(rsp));
        },
      });
    }),
  post: (url, options) =>
    wxApi.request(url, { method: 'POST', responseType: 'json', ...options }),
  get: (url, options) =>
    wxApi.request(url, { responseType: 'json', ...options }),
};

export default 'undefined' !== typeof wx && wx.getSystemInfoSync
  ? wxApi
  : jsApi;
