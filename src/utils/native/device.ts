import Taro from '@tarojs/taro'

const systemInfoResult = Taro.getSystemInfoSync()
const menuBarBoundingResult = Taro.getMenuButtonBoundingClientRect()

export type DeviceProps = Taro.getSystemInfoSync.Result & {
  titleBarHeight?: number
}

export function getSystemInfo() {
  const systemInfo = systemInfoResult
  const { titleBarHeight } = systemInfo as any
  return {
    ...systemInfo,
    titleBarHeight: titleBarHeight ? Number(titleBarHeight) : undefined,
  }
}

export function getSystemInfoByKey<TKey extends keyof DeviceProps>(key: TKey) {
  const props = getSystemInfo()
  return props[key]
}

export function getMenuBarBounding() {
  return menuBarBoundingResult
}

export function getDistanceFromStatusBarToMenuBar() {
  const systemInfo = systemInfoResult
  const menuBarBounding = getMenuBarBounding()

  return menuBarBounding.top - systemInfo.statusBarHeight
}
