import React, { useCallback } from 'react'
import classNames from 'classnames'
import { ITouchEvent, View } from '@tarojs/components'

import icons from './icons'

import classes from './Index.module.scss'

export type IconType = keyof typeof icons

const IconClass: Record<IconType, string> = {
  Search: classes.Search,
  Share: classes.Share,
  Func: classes.Func,
  ArrowLeft: classes.ArrowLeft,
}

export interface IconProps {
  color?: string
  /**
   * 0.5 - 3
   */
  scale?: number
  icon: IconType
  className?: string
  onClick?: (event: ITouchEvent) => void
}

function Index(props: IconProps) {
  const {
    color, //
    scale = 1,
    icon,
    className,
    onClick,
  } = props
  const formattedScale = Math.min(3, Math.max(0.5, scale))
  const stopPropagation = useCallback(
    (event: ITouchEvent) => {
      if (onClick) {
        event.stopPropagation()
        onClick(event)
      }
    },
    [onClick],
  )
  return (
    <View
      className={classNames(classes.Icon, IconClass[icon], className)}
      style={{
        color,
        width: `${formattedScale * 1}em`,
        height: `${formattedScale * 1}em`,
      }}
      onClick={stopPropagation}
    />
  )
}

export const Search = (props: Omit<IconProps, 'icon'>) => (
  <Index {...props} icon='Search' />
)

export const Func = (props: Omit<IconProps, 'icon'>) => (
  <Index {...props} icon='Func' />
)

export const Share = (props: Omit<IconProps, 'icon'>) => (
  <Index {...props} icon='Share' />
)

export const ArrowLeft = (props: Omit<IconProps, 'icon'>) => (
  <Index {...props} icon='ArrowLeft' />
)

export default Index
