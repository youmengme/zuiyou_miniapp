import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import isEqual from 'lodash/isEqual'

const initialCache: {
  value: object
  set: (_key: string, _data: unknown) => void
} = {
  value: {},
  set: (_key: string, _data: unknown) => ({}),
}

const CacheContext = createContext(initialCache)

const { Provider } = CacheContext

function ProviderWrapper(props: { children: ReactNode }) {
  const { children } = props
  const [cache, setCache] = useState({})
  // useEffect(() => {
  //   console.log('Cache Changed', cache)
  // }, [cache])
  const set = useCallback((key: string, data: unknown) => {
    setCache((prev) => {
      if (!isEqual(data, prev[key])) {
        // console.warn('setting', key, data)
        return {
          ...prev,
          [key]: data,
        }
      }
      // console.log(`%c setting cache[${key}] skipped: equal with prev value`, 'color: green; font-weight: bold;')
      return prev
    })
  }, [])
  const value = useMemo(
    () => ({
      value: cache,
      set,
    }),
    [cache, set],
  )
  return <Provider value={value}>{children}</Provider>
}

export { ProviderWrapper as CacheProvider, CacheContext }

export default function useCache<T>(key: string, initialValue?: T) {
  const context = useContext(CacheContext)
  // TODO: 调研一下哪种写法性能是否更好
  // const [value, setValue] = useState<T | undefined>(key in context.value ? context.value[key] : initialValue)
  // useEffect(() => {
  //   context.set(key, value)
  // }, [context, key, value])
  const value = useMemo(
    () => (key in context.value ? context.value[key] : initialValue),
    [context.value, initialValue, key],
  )
  // const value = key in context.value ? context.value[key] : initialValue
  // console.log(`useCache->${key}`, 'initialValue', initialValue, 'realValue', value)

  const set = useCallback(
    (newValue: T | undefined | ((prev: T | undefined) => T)) => {
      // console.log(`useCache->set->${key}`, newValue)
      if (typeof newValue === 'function' && newValue instanceof Function) {
        context.set(key, newValue(context.value[key]))
        // setValue(prevValue => newValue(prevValue))
      } else {
        context.set(key, newValue)
        // setValue(newValue)
      }
      // setValue(newValue)
    },
    [context, key],
  )

  const firstTime = useRef(true)

  useEffect(() => {
    if (firstTime.current
      && !(key in context.value || context.value[key] === undefined)
      && initialValue !== undefined) {
      set(initialValue)
    }
    firstTime.current = false
  }, [context.value, initialValue, key, set])

  return [value as T | undefined, set] as const
}
