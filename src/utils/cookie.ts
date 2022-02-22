import Taro from '@tarojs/taro'
import dayJs from 'dayjs'

export function setCookie<T>(
  key: string,
  value: T,
  options?: { expires?: number },
) {
  const expires = options?.expires || 0
  return Taro.setStorage({
    key,
    data: {
      endTime: expires,
      value,
    },
  })
}

export function getCookieSync<T = string>(key: string): T | string | undefined {
  const data = Taro.getStorageSync<
    { value: T | undefined; endTime: number }
  >(key)
  if (typeof data === 'string') {
    return data as string
  }
  if (!data || Number(dayJs()) > data.endTime) {
    Taro.removeStorage({ key })
    return undefined
  }
  return data.value
}

export function getCookie<T>(key: string) {
  return Taro
    .getStorage<{ value: T | undefined; endTime: number }>({ key })
    .then((res) => {
      if (!res || !res.data) {
        return undefined
      }
      if (typeof res.data === 'string') {
        return res.data as string
      }
      if (Number(dayJs()) > res.data.endTime) {
        Taro.removeStorage({ key })
        return undefined
      }
      return res.data.value
    })
    .catch(() => undefined)
}

export function removeCookie(key: string) {
  Taro.removeStorage({ key })
}
