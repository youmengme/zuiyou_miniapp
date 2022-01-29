import { useCallback, useEffect, useRef, useState } from 'react'
import { useReady } from '@tarojs/taro'
import { getSystemInfoByKey } from '../utils/native/device'

import {
  BoundingClientRect,
  checkDomExisted,
  getElementBoundingClientRect,
  getElementScrollPosition,
} from '../utils/native/dom'

export function useElementBoundingClientRect(selector: string) {
  const [bounding, setBounding] = useState<BoundingClientRect>()

  const updateBounding = useCallback(
    () => getElementBoundingClientRect(selector)
      .then((result) => {
        setBounding(result)
        return result
      }),
    [selector],
  )

  useEffect(() => {
    updateBounding()
  }, [updateBounding])

  return [
    bounding,
    updateBounding,
  ] as const
}

export function useRenderFinished(callback: () => void, options: {
  selector: string
}) {
  const { selector } = options || {}
  useEffect(() => {
    async function check() {
      for (let i = 0; i < 10; i++) {
        // eslint-disable-next-line no-await-in-loop
        const renderFinished = await checkDomExisted(selector)
        if (renderFinished) {
          callback()
          break
        }
      }
    }

    check()
  }, [callback, selector])
}

export function useElementMoveToHorizontalCenter() {
  const [scrollLeft, setScrollLeft] = useState(0)

  const move = useCallback(async (wrapperSelector, elementId: string) => {
    const screenWidth = getSystemInfoByKey('screenWidth')
    const centerXOfScreen = screenWidth / 2
    const bounding = await getElementBoundingClientRect(`#${elementId}`)
    const centerOfTarget = (bounding?.left || 0)
      + ((bounding?.width || 0) / 2)
    const wrapperBounding = await getElementScrollPosition(
      `${wrapperSelector}`,
    )

    if (wrapperBounding) {
      setScrollLeft(
        wrapperBounding.scrollLeft
        + (centerOfTarget - centerXOfScreen),
      )
    }
  }, [])

  return {
    scrollLeft,
    move,
  }
}

export function useScenePageEnter(cb?: () => void) {
  useReady(() => {
    if (cb) cb()
  })
}

export function usePageEnter() {
  const enterRef = useRef(false)
  useEffect(() => {
    enterRef.current = true
    return () => {
      enterRef.current = false
    }
  }, [])
  return () => enterRef.current
}

export function usePageLeave(cb?: () => void) {
  const isLeaved = usePageEnter()
  useEffect(() => () => {
    if (!isLeaved() && cb) {
      cb()
    }
  },
  [
    cb,
    isLeaved,
  ])
}
