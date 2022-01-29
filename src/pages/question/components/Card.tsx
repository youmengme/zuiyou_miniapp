import React, { useCallback, useMemo } from 'react'
import Taro from '@tarojs/taro'
import { Image, Swiper, SwiperItem, View } from '@tarojs/components'
import Icon from '../../../components/Icon'
import { Toast } from '../../../utils/Toast'

import classes from './Card.module.scss'

interface Props {
  data: {
    wiki: {
      title: string
      name: string
      desc: string
      imgs: Array<string>
    }
    member: {
      name: string
      avatar: string
    }
  }
  onShare?: () => void
}

export default function Card(props: Props) {
  const { data } = props

  const onShare = useCallback(() => {
    Toast('此条目暂不支持分享')
  }, [])

  const images = useMemo(
    () => data?.wiki?.imgs || [],
    [data?.wiki?.imgs])

  const onPreview = useCallback(() => {
    if (!images?.length) return
    Taro.previewImage({
      urls: images
    })
  }, [images])

  return (
    <View className={classes.Card}>
      <View className={classes.title}>
        {data.wiki.title}
      </View>
      <View className={classes.desc}>
        {data.wiki.desc}
      </View>
      {
        images.length
          ? (
            images.length === 1
              ? <Image
                  src={images[0]}
                  mode='widthFix'
                  onClick={() => onPreview()}
              />
              : (
                <Swiper onClick={() => onPreview()}>
                  {
                    images.map(ele => (
                      <SwiperItem key={ele}>
                        <Image src={ele} mode='widthFix' />
                      </SwiperItem>
                    ))
                  }
                </Swiper>
              )
          )
          : null
      }

      <View className={classes.member}>
        <View className={classes.userInfo}>
          <Image
            className={classes.avatar}
            src={data.member.avatar}
          />
          <View className={classes.userName}>
            {data.member.name}
          </View>
        </View>
        <Icon
          icon='Share'
          className={classes.share}
          color='#999'
          onClick={onShare}
        />
      </View>
    </View>
  )
}
