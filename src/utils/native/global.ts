/**
 * 转发原生环境的 `nextTick` 方法
 *
 * 一般情况不需要调用此方法，直接使用 `Taro.nextTick` 即可
 *
 * @remark Taro.nextTick 做了类似于死循环检测的设置，在动画等场景中不能递归调用
 */
export function nextTick(callback: Function) {
  setTimeout(() => {
    callback()
  }, 0)
}
