import Taro from '@tarojs/taro'
import Qs from 'query-string'

type ResponseData = object | boolean | number | string | undefined

class HttpClient {
  preRequest: (option: Taro.cloud.CallContainerParam) => void

  baseUrl: string

  /**
   *
   */
  constructor(
    preRequest: (option: Taro.cloud.CallContainerParam) => void,
    baseUrl: string,
  ) {
    this.preRequest = preRequest
    this.baseUrl = baseUrl
  }

  baseOptions<T, TData extends object = {}>(
    params: Taro.cloud.CallContainerParam,
    method: keyof Taro.request.method = 'GET',
  ) {
    const { path, data } = params

    const option = {
      ...params,
      path,
      data,
      method,
      header: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }
    this.preRequest(option)
    return (
      Taro.cloud.callContainer<Response<T>, TData>(option)
    ) as unknown as Promise<Response<T>>
  }

  get<T extends ResponseData>(url: string, params?: object) {
    const option = {
      path: url,
      data: params,
    }
    if (option.data) {
      const separator = url.indexOf('?') > 0 ? '&' : '?'
      option.path = `${option.path}${separator}${Qs.stringify(option.data)}`
      option.data = undefined
    }
    return this.baseOptions<T, object>(option)
  }

  post<T extends ResponseData>(url, data?: object) {
    const params = {
      path: url,
      data,
    }
    return this.baseOptions<T, object>(params, 'POST')
  }

  put<T extends ResponseData>(url, data?: object) {
    const option = {
      path: url,
      data,
    }
    return this.baseOptions<T, object>(option, 'PUT')
  }

  delete<T extends ResponseData>(url, params: object) {
    const separator = url.indexOf('?') > 0 ? '&' : '?'
    const formattedUrl = `${url}${separator}${Qs.stringify(params, { arrayFormat: 'separator' })}`
    const option = { path: formattedUrl }
    return this.baseOptions<T>(option, 'DELETE')
  }
}

export default HttpClient
