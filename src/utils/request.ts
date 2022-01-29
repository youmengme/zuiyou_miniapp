import Taro from '@tarojs/taro'

export default function request<T>(method, url, data) {
  return new Promise<Response<T>>((resolve, reject) => {
    Taro
      .cloud
      .callContainer<Response<T>>({
        // @ts-ignore
        'config': {
          'env': 'prod-3g1p7vbd72d7fd09'
        },
        'path': url,
        'header': {
          'X-WX-SERVICE': 'express-s6zf'
        },
        method,
        data
      })
      .then(res => {
        resolve(res.data as Response<T>)
      })
      .catch(e => reject(e))
  })
}

export function get<T>(url, params) {
  return request<T>('GET', url, params)
}

export function post<T>(url, data) {
  return request<T>('POST', url, data)
}

