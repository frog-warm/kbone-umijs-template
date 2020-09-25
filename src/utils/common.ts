export function toPage(name: string, queryString?: string) {
  if ('undefined' != typeof wx && wx.getSystemInfoSync) {
    wx.navigateTo({
      url: `../${name}/index?${queryString || ''}`,
    });
  } else {
    window.location.hash = `/${name}${queryString ? '?' + queryString : ''}`;
  }
}

export const globalValue = (key: string, value?: string) => {
  if (value) {
    // @ts-ignore
    window.$$global
      ? // @ts-ignore
        (window.$$global[key] = value)
      : localStorage.setItem(key, value);
    return value;
  }
  // @ts-ignore
  return window.$$global ? window.$$global[key] : localStorage.getItem(key);
};

export function addQueryStringToUrl(url: string, data: {
  [key in string]: any
}) {
  if (typeof url === "string" && typeof data === "object" && data !== null && Object.keys(data).length > 0) {
      const parts = url.split("?")
      const path = parts[0]
      const query = (parts[1] || "").split("&").reduce((pre: {
          [key in string]: any
      }, cur) => {
          if (typeof cur === "string" && cur.length > 0) {
              const parts = cur.split("=")
              const key = parts[0]
              const value = parts[1]
              pre[key] = value
          }
          return pre
      }, {})

      // 把 data 中的数据 encodeURIComponent
      const encodedData = Object.keys(data).reduce((ret: {
          [key in string]: any
      }, key) => {
          if (typeof data[key] === "object") {
              ret[encodeURIComponent(key)] = encodeURIComponent(JSON.stringify(data[key]))
          } else {
              ret[encodeURIComponent(key)] = encodeURIComponent(data[key])
          }
          return ret
      }, {})
      return path + "?" + urlEncodeFormData(Object.assign(query, encodedData))
  } else {
      return url
  }
}

export function urlEncodeFormData(data: {
  [key in string]: any
}, needEncode = false) {
  if (typeof data !== "object") {
      return data
  }
  const dataArray = []

  for (const k in data) {
      // eslint-disable-next-line
      if (data.hasOwnProperty(k)) {
          if (needEncode) {
              try {
                  dataArray.push(`${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
              } catch (e) {
                  dataArray.push(`${k}=${data[k]}`)
              }
          } else {
              dataArray.push(`${k}=${data[k]}`)
          }
      }
  }
  return dataArray.join("&")
}

export function convertObjectValueToString(object: {
  [key in string]: any
}) {
  return Object.keys(object).reduce((ret: {
      [key in string]: any
  }, key) => {
      if (typeof object[key] === "string") {
          ret[key] = object[key]
      } else if (typeof object[key] === "number") {
          ret[key] = object[key] + ""
      } else {
          ret[key] = Object.prototype.toString.apply(object[key])
      }
      return ret
  }, {})
}
export function getType(data: {} | any) {
  return Object.prototype.toString.call(data).slice(8, -1)
}
