import Taro, { AuthSetting } from '@tarojs/taro'

export function checkSetting(setting: keyof AuthSetting) {
  return new Promise<boolean>((resolve, reject) => {
    Taro.getSetting().then((res) => {
      if (res.authSetting[setting]) {
        resolve(res.authSetting[setting]!)
      } else {
        reject(new Error(res.errMsg))
      }
    })
  })
}

/**
 * 检查定位权限状态
 */
export function checkLocatePermission() {
  return new Promise<boolean>((resolve, reject) => {
    checkSetting('scope.userLocation')
      .then(() => {
        resolve(true)
      }, () => {
        Taro.openSetting()
          .then((res) => {
            if (res.authSetting['scope.userLocation']) {
              resolve(true)
            } else {
              reject(new Error(res.errMsg))
            }
          })
      })
  })
}
