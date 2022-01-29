import React, { Fragment, useEffect, useState } from 'react'
import classNames from 'classnames'
import { View } from '@tarojs/components'

import { getDistanceFromStatusBarToMenuBar, getMenuBarBounding, getSystemInfo } from '../utils/native/device'

import classes from './Header.module.scss'

/**
 * Header容器：定位于信号条底部至页面顶部位置，中线与胶囊对齐
 *
 */
export interface HeaderProps {
  children?: React.ReactNode
  /**
   * 是否占满整屏宽度
   *
   * `默认`为屏幕左侧至胶囊左侧
   */
  fullWidth?: boolean

  /**
   * 是否占用页面高度
   *
   * `false`: 会占用页面顶部高度 (默认值)
   *
   * `true` : 页面内容从最 0 开始(Header悬浮在更高的 z-index  层级)
   * */
  pageStartFromZero?: boolean
  /**
   * 是否使用 `sticky` 布局
   *
   * 默认使用 `fixed`，当页面整体下拉时 CustomerHeader 区域会固定在顶部
   *
   * 如果需要 CustomerHeader 区域 跟随页面下拉，需要使用 `sticky` 布局，此时 `setPaddingTop` 属性失效
   * */
  sticky?: boolean
  className?: string
  title?: string
  titleColor?: string
}

const menuBarBounding = getMenuBarBounding()

function Header(props: HeaderProps) {
  const {
    fullWidth = false,
    children,
    pageStartFromZero = false,
    sticky,
    className,
    title,
    titleColor
  } = props

  const [
    headerStyle,
    setHeaderStyle
  ] = useState<React.CSSProperties>()

  const [
    placeholderStyle,
    setPlaceholderStyle
  ] = useState<React.CSSProperties>()

  useEffect(() => {
    const systemInfo = getSystemInfo()

    async function updateStyle() {
      const gap = await getDistanceFromStatusBarToMenuBar()
      setHeaderStyle((styles) => ({
        ...styles,
        height: menuBarBounding.height + gap * 2,
        top: `${systemInfo.statusBarHeight}px`
      }))

      setPlaceholderStyle({ height: menuBarBounding.height + gap * 2 })
    }

    updateStyle()
  }, [])
  return (
    <Fragment>
      <View
        className={
          classNames(
            classes.box,
            className,
            {
              [classes.sticky]: sticky
            }
          )
        }
        style={headerStyle}
      >
        {
          title
            ? (
              <View
                className={classes.centerText}
                style={{ color: titleColor }}
              >
                {title}
              </View>
            )
            : (
              <View
                className={
                  classNames(
                    classes.Header,
                    { [classes.fullWidth]: fullWidth }
                  )
                }
                style={
                  {
                    width: `${menuBarBounding.left - 10}px`
                  }
                }
              >
                {children}
              </View>
            )
        }

      </View>
      {
        pageStartFromZero || sticky === true
          ? null
          : (
            <View className={classes.placeholder} style={placeholderStyle} />
          )
      }
    </Fragment>
  )
}

export default Header
