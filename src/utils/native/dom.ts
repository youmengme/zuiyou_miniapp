import Taro from '@tarojs/taro'

export function checkDomExisted(selector: string) {
  return new Promise((resolve) => {
    Taro.nextTick(() => {
      const document = Taro.createSelectorQuery()
      document
        .select(selector)
        .fields({}, () => ({}))
        .exec((res) => {
          if (res.some(Boolean)) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
    })
  })
}

/**
 * @desc 获取元素相对于页面顶端的滚动高度
 * @param selector
 */
export function getElementOffsetTop(selector: string) {
  return new Promise<number>((resolve, reject) => {
    try {
      const query = Taro.createSelectorQuery()
      query
        .select(selector)
        .boundingClientRect()
        .selectViewport()
        .scrollOffset()
        .exec((res) => {
          let offsetTop = 0
          let scrollTop = 0
          if (res && res[0]) {
            offsetTop = res[0].top
          }
          if (res && res[1]) {
            scrollTop = res[1].scrollTop
          }
          resolve(offsetTop + scrollTop)
        })
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * @desc 获取元素相对于页面顶/左的滚动高度
 * @param selector
 */
export function getElementOffset(selector: string) {
  return new Promise<{
    offsetTop: number
    offsetLeft: number
  }>((resolve, reject) => {
    try {
      const query = Taro.createSelectorQuery()
      query
        .select(selector)
        .boundingClientRect()
        .selectViewport()
        .scrollOffset()
        .exec((res) => {
          let offsetTop = 0
          let scrollTop = 0
          let offsetLeft = 0
          let scrollLeft = 0
          if (res && res[0]) {
            offsetTop = res[0].top
            offsetLeft = res[0].left
          }
          if (res && res[1]) {
            scrollTop = res[1].scrollTop
            scrollLeft = res[1].scrollLeft
          }
          resolve({
            offsetTop: offsetTop + scrollTop,
            offsetLeft: offsetLeft + scrollLeft,
          })
        })
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * @desc 获取元素的垂直滚动距离 & 水平滚动距离
 * @param selector
 */
export function getElementScrollPosition(selector: string) {
  return new Promise<{
    scrollTop: number
    scrollLeft: number
    scrollHeight: number
    scrollWidth: number
  }>((resolve, reject) => {
    try {
      const query = Taro.createSelectorQuery()
      query
        .select(selector)
        .scrollOffset()
        .exec((res) => {
          let scrollTop = 0
          let scrollLeft = 0
          let scrollHeight = 0
          let scrollWidth = 0
          if (res && res[0]) {
            scrollTop = res[0].scrollTop
            scrollLeft = res[0].scrollLeft
            scrollHeight = res[0].scrollHeight
            scrollWidth = res[0].scrollWidth
          }
          resolve({
            scrollTop,
            scrollLeft,
            scrollHeight,
            scrollWidth,
          })
        })
    } catch (e) {
      reject(e)
    }
  })
}

export interface BoundingClientRect {
  width: number
  height: number
  top: number
  bottom: number
  right: number
  left: number
  id?: string
}

export interface ElementBounding extends BoundingClientRect {
  offsetTop: number
}

/**
 * @desc 获取元素尺寸
 * @param selector
 */
export function getElementBoundingClientRect(selector: string) {
  return new Promise<BoundingClientRect | undefined>((resolve, reject) => {
    function getBounding() {
      const $ = Taro.createSelectorQuery()
      $.select(selector)
        .boundingClientRect()
        .exec((res) => {
          if (res && res[0]) {
            resolve(res[0])
          } else {
            resolve(undefined)
          }
        })
    }
    try {
      const timer = setTimeout(() => {
        getBounding()
      }, 16)
      Taro.nextTick(() => {
        clearTimeout(timer)
        getBounding()
      })
    } catch (e) {
      reject(e)
    }
  })
}

export async function getElementBounding(selector: string) {
  const [offset, bounding] = await Promise.all([
    getElementOffset(selector),
    getElementBoundingClientRect(selector),
  ])
  return {
    ...bounding,
    offsetTop: offset.offsetTop,
    offsetLeft: offset.offsetLeft,
  } as ElementBounding
}

export function elementExisted(selector: string, retryTimes = 10) {
  return new Promise<number>((resolve, reject) => {
    function check() {
      return new Promise<number>((innerResolve) => {
        Taro.nextTick(() => {
          const $ = Taro.createSelectorQuery()
          $.selectAll(selector)
            .fields({}, () => { })
            .exec((res) => {
              if (res.some(Boolean) && res[0].some(Boolean)) {
                innerResolve(res[0].length)
              }
              innerResolve(0)
            })
        })
      })
    }
    try {
      (async () => {
        for (let index = 0; index < retryTimes; index++) {
          // eslint-disable-next-line no-await-in-loop
          const count = await check()
          if (count) {
            resolve(count)
          }
        }
        resolve(0)
      })()
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * @name analyzeScene
 * @desc 解析scene(key1:val1,key2:val2)参数为Object({key1: val1, key2:val2})
 * @param scene
 * @returns {key: val}
 */
export function analyzeScene<T extends object = Record<string, string>>(
  scene: string | undefined,
) {
  let tempObj = {}
  try {
    if (scene) {
      tempObj = decodeURIComponent(scene).split(',').reduce((p, c) => {
        const [key, val] = c.split(':')
        if (key && val) {
          return {
            ...p,
            [key]: val,
          }
        }
        return p
      }, {})
    }
  } catch (_error) {
    // ignore _error
  }
  return tempObj as T
}
