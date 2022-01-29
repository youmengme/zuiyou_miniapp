import Taro from '@tarojs/taro'

export class Routes {
  Index = '/pages/question/index'
  Question = {
    Main: '/pages/question/index',
    Search: (kw?: string) => `/pages/question/search?kw=${kw}`
  }
  Hero = {
    Main: '/pages/hero/index',
    Search: (kw?: string) => `/pages/hero/search?kw=${kw}`,
    Detail: (heroId?: string) => `/pages/hero/detail?id=${heroId}`
  }
}

export const routes = new Routes()

export function navigateTo(url: string) {
  Taro.navigateTo({
    url
  })
}

export function redirectTo(url: string) {
  Taro.redirectTo({
    url
  })
}

export function navigateBack(delta = 1) {
  Taro.navigateBack({delta})
}
