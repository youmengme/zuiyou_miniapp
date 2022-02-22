import {
  useState, //
  useEffect,
  useCallback,
  useRef,
  DependencyList,
  useMemo,
} from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import Qs from 'query-string'

import { getCookieSync, getCookie, setCookie, removeCookie } from '../utils/cookie'
import useCache from '../utils/cache'
import { analyzeScene } from '../utils/native/dom'

export function useStorage<TValue = string>(
  key: string,
  initialValue?: TValue | undefined,
) {
  const [value, setValue] = useState<TValue | undefined>(
    (Taro.getStorageSync(key) as TValue) || initialValue,
  )

  const update = useCallback(
    (newValue?: TValue | Function) => {
      const valueToStore = newValue instanceof Function
        ? newValue(value)
        : newValue
      setValue(valueToStore)

      if (newValue === undefined) {
        return Taro.removeStorage({ key })
      }
      return Taro.setStorage({
        key,
        data: newValue,
      })
    },
    [key, value],
  )
  return [
    value,
    /**
     * send `undefined` to delete `key` from storage
     */
    update,
  ] as const
}

export function useCookie<TValue = string>(
  key: string,
  options?: {
    expires?: number
  },
) {
  const [value, setValue] = useState<TValue | string | undefined>(
    getCookieSync<TValue>(key),
  )

  const refresh = useCallback(() => {
    try {
      return getCookie(key)
    } catch {
      // Ignore error
    }
    return undefined
  }, [key])

  const set = useCallback(
    (newValue?: TValue) => setCookie(key, newValue, options),
    [key, options],
  )

  const remove = useCallback(() => {
    removeCookie(key)
    setValue(undefined)
  }, [key])

  return {
    value,
    refresh,
    set,
    remove,
  }
}

export function useOnce(runSucceed: () => boolean, deps: DependencyList) {
  const firstTime = useRef(true)
  useEffect(() => {
    if (firstTime.current && runSucceed()) {
      firstTime.current = false
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export function useQueryString<T>() {
  const router = useRouter<T>()
  return router.params as Partial<T>
}

type QueryParams = Partial<Record<string, string>>
/**
 * 通过扫描普通二维码打开小程序，原始链接会作为 q 参数传入小程序页面
 *
 * @returns
 */
export function useQrcodeQueryString<
  T extends QueryParams
>() {
  const { q } = useQueryString<{ q: string }>()
  if (!q) return {} as QueryParams
  const [_, query] = decodeURIComponent(q).split('?')
  if (!query) return {} as QueryParams
  return Qs.parse(query) as T
}

export function useDebounce(value: string, delay: number = 200) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler: NodeJS.Timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useLaunchOptions() {
  const [launchOptions, setLaunchOptions] = useCache<Taro.General.LaunchOptionsApp>('PROJECT_LAUNCH_OPTIONS')
  useEffect(() => {
    setLaunchOptions(Taro.getLaunchOptionsSync())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return launchOptions
}

export function useSceneString() {
  const query = useQueryString<{ scene: string }>()
  const launchOptions = useLaunchOptions()
  const scene = useMemo(
    () => decodeURIComponent(
      query.scene || launchOptions?.query.scene || launchOptions?.scene || '',
    ),
    [launchOptions?.query.scene, launchOptions?.scene, query.scene],
  )
  return scene
}

export function useScene<T extends Record<string, string>>() {
  const scene = useSceneString()
  return analyzeScene(scene) as T
}
