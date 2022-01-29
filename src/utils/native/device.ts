import Taro from '@tarojs/taro'

const systemInfoResult = Taro.getSystemInfoSync()
const menuBarBoundingResult = Taro.getMenuButtonBoundingClientRect()

export type DeviceProps = Taro.getSystemInfoSync.Result & {
  titleBarHeight?: number
}

export function getSystemInfo() {
  const systemInfo = systemInfoResult
  if (systemInfo.brand === 'devtools') {
    systemInfo.brand = systemInfo.system.indexOf('iOS') >= 0 ? 'iPhone' : ''
    systemInfo.model = systemInfo.model.indexOf('iPhone') >= 0 ? 'iPhone12,1' : ''
  } else {
    // iPhone 12 Pro<iPhone13,3> => iPhone13,3
    systemInfo.model = systemInfo.model.replace(/.*<(.*)>/ig, '$1')
  }
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

export async function getDistanceFromStatusBarToMenuBar() {
  const systemInfo = systemInfoResult
  const menuBarBounding = await getMenuBarBounding()

  const adjust = menuBarBounding.top - systemInfo.statusBarHeight
  return adjust
}
