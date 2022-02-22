import React, { useCallback, useState } from 'react'
import classNames from 'classnames'
import Taro, { useDidShow } from '@tarojs/taro'
import { Image, View } from '@tarojs/components'
import Message from '../../assets/icons/message.svg'
import Hot from '../../assets/icons/hot.svg'
// import Recommend from '../../assets/icons/recommend.svg'

import classes from './index.module.scss'
import { redirectTo } from '../../routes'
import { getCurrentPage } from '../../utils/functions'

const tabs = [
  {
    image: Message,
    activeImage: Message,
    text: '梗查查',
    url: '/pages/question/index'
  },
  {
    image: Hot,
    activeImage: Hot,
    text: '荣耀战力',
    url: '/pages/hero/index'
  },
  // {
  //   image: Recommend,
  //   activeImage: Recommend,
  //   text: '吃鸡捏脸',
  //   url: '/pages/question/index'
  // }
]
export default function Tabbar() {
  const [currentUrl, setCurrentUrl] = useState('')
  useDidShow(() => {
    const page = Taro.getCurrentPages()[0]
    setCurrentUrl('/' + page.route)
  })
  const handleClickTab = useCallback((item) => {
    const { route } = getCurrentPage() || {}
    if (route === item.url.slice(1)) return
    redirectTo(item.url)
  }, [])

  return (
    <View className={classes.tabbar}>
      {
        tabs.map(ele => (
          <View
            className={classNames(
              classes.tab,
              {
                [classes.active]: currentUrl === ele.url
              }
            )}
            key={ele.text}
            onClick={() => handleClickTab(ele)}
          >
            <Image
              className={classes.image}
              src={ele.image}
            />
            <View className={classes.text}>
              {ele.text}
            </View>
          </View>
        ))
      }
    </View>
  )
}
