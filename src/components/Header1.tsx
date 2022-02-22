import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { View } from '@tarojs/components'
import Icon from './Icon'

import classes from './Header1.module.scss'
import { getDistanceFromStatusBarToMenuBar, getMenuBarBounding, getSystemInfo } from '../utils/native/device'
import { navigateBack } from '../routes'

interface Props {
  onBackAction?: () => void
  title?: string | ReactNode
  sticky?: boolean
  hideBack?: boolean
  rightSafeArea?: boolean
  children?: ReactNode
}

const menuBarBounding = getMenuBarBounding()

export default function Header(props: Props) {
  const {
    title,
    sticky,
    rightSafeArea,
    hideBack,
    children,
    onBackAction,
  } = props
  const [
    headerStyle,
    setHeaderStyle
  ] = useState<React.CSSProperties>()

  useEffect(() => {
    const systemInfo = getSystemInfo()
    const gap = getDistanceFromStatusBarToMenuBar()
    setHeaderStyle((styles) => ({
      ...styles,
      height: menuBarBounding.height + gap * 2,
      top: `${systemInfo.statusBarHeight}px`
    }))
  }, [])
  const handleOnAction = useCallback(
    () => {
      if (onBackAction) {
        onBackAction()
        return
      }
      navigateBack()
    },
    [onBackAction]
  )
  return (
    <View
      className={classNames(
        classes.Header,
        {
          [classes.sticky]: sticky,
          [classes.safe]: !hideBack
        }
      )}
      style={headerStyle}
    >
      {
        !hideBack
          ? (
            <View
              className={classes.back}
              onClick={handleOnAction}
            >
              <Icon
                icon='ArrowLeft'
                className={classes.icon}
              />
            </View>
          )
          : null
      }
      <View className={classNames(
        classes.content,
        {
          [classes.safeArea]: rightSafeArea
        }
      )}
      >
        {title || children || null}
      </View>
    </View>
  )
}
