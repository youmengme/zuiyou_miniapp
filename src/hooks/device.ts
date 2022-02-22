import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react'
import debounce from 'lodash.debounce'
import Taro from '@tarojs/taro'

import {
  getMenuBarBounding,
  getDistanceFromStatusBarToMenuBar,
} from '../utils/native/device'

export function useCustomHeader() {
  const [height, setHeight] = useState(0)
  useEffect(() => {
    async function calculateHeight() {
      const menuBarBounding = await getMenuBarBounding()
      const gap = await getDistanceFromStatusBarToMenuBar()
      setHeight(menuBarBounding.bottom + gap)
    }
    calculateHeight()
  }, [])
  return { height }
}

type Styles = (customHeaderHeight: number) => CSSProperties

export function useCustomHeaderStyle(styles?: CSSProperties | Styles)
  : CSSProperties {
  const { height } = useCustomHeader()

  if (!styles) return { top: `${height}px` }
  if (typeof styles === 'object') {
    return {
      ...styles,
      top: `${height}px`,
    }
  }

  return { ...styles(height) }
}

export function useDeviceMotion() {
  const [orientation, setOrientation] = useState<
    Taro.onDeviceMotionChange.CallbackResult
  >()

  const debouncedHandler = useMemo(
    () => debounce(setOrientation, 16),
    [],
  )

  const handleMotion = useCallback(
    (event: Taro.onDeviceMotionChange.CallbackResult) => {
      debouncedHandler(event)
    },
    [debouncedHandler],
  )

  useEffect(() => {
    Taro.onDeviceMotionChange(handleMotion)
    return () => {
      Taro.offDeviceMotionChange(handleMotion)
    }
  }, [handleMotion])

  return orientation
}
