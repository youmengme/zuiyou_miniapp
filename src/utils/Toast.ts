import Taro from '@tarojs/taro'
import { isUndefined, isString } from './validator'

const defaultDuration = 3000

const toastConfig: Taro.showToast.Option = {
  title: '',
  icon: 'none',
  duration: defaultDuration,
}

let toastExisted = false
let loadingExisted = false
let loadingTimer: NodeJS.Timeout | undefined

function close() {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    loadingTimer = undefined
  }
  if (toastExisted) {
    Taro.hideToast()
    toastExisted = false
  }
  if (loadingExisted) {
    Taro.hideLoading()
    loadingExisted = false
  }
}

function Toast(option: string | Taro.showToast.Option) {
  const options: Taro.showToast.Option = isString(option) ? {
    ...toastConfig,
    title: option,
    icon: 'none',
  } : {
    ...option,
    icon: option?.icon || 'none',
  }
  const { duration } = options
  setTimeout(() => {
    toastExisted = false
  }, duration)
  toastExisted = true
  Taro.showToast(options)
}

type LoadingOption = Taro.showLoading.Option & {
  /**
   * 单位: ms
   */
  duration?: number
}
const loadingConfig: LoadingOption = {
  title: '加载中...',
  duration: defaultDuration,
}

function Loading(option?: string | LoadingOption) {
  const options: LoadingOption = isUndefined(option) || isString(option)
    ? {
      ...loadingConfig,
      title: option || loadingConfig.title,
    }
    : {
      ...option,
      duration: (option?.duration || 3 * 1000),
    }

  loadingTimer = setTimeout(() => {
    loadingExisted = true
    Taro.showLoading(options)
    setTimeout(() => {
      loadingExisted = false
      close()
    }, options.duration)
  }, 100)
  return loadingTimer
}

Loading.close = () => {
  close()
}

export { Toast, Loading }
