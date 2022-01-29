import React, { useEffect } from 'react'
import classNames from 'classnames'
import { View } from '@tarojs/components'
import { getMenuBarBounding, getSystemInfo } from '../utils/native/device'
import classes from './SystemHeader.module.scss'

const env = getSystemInfo()
console.log('getMenuBarBounding', getMenuBarBounding())
export interface SystemHeaderProps {
  /**
   * 是否使用 `sticky` 布局
   *
   * 默认使用 `fixed`，当页面整体下拉时 CustomerHeader 区域会固定在顶部
   *
   * 如果需要 CustomerHeader 区域 跟随页面下拉，需要使用 `sticky` 布局，此时 `setPaddingTop` 属性失效
   * */
  sticky?: boolean
  /**
   * 是否占用页面高度
   *
   * `false`: 会占用页面顶部高度 (默认值)
   *
   * `true` : 页面内容从最 0 开始(Header悬浮在更高的 z-index  层级)
   * */
  pageStartFromZero?: boolean

  className?: string
}

function SystemHeader(props: SystemHeaderProps) {
  useEffect(
    () => {
      console.log(getMenuBarBounding())
    },
    []
  )
  const {
    pageStartFromZero = false,
    sticky,
    className
  } = props
  return (
    <>
      <View
        className={classNames(
          classes.box,
          className,
          {
            [classes.sticky]: sticky,
          },
        )}
        style={{ height: `${env.statusBarHeight}px` }}
      >
        <View
          className={classNames(classes.SystemHeader)}
        />
      </View>
      {pageStartFromZero || sticky === true
        ? null
        : (
          <View className={classes.placeholder} style={{ height: `${env.statusBarHeight}px` }} />
        )}
    </>
  )
}

export default SystemHeader
