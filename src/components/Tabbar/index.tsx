import React from 'react'
import { View, Image } from '@tarojs/components'
import classes from './index.module.scss'

const tabs = [
  {
    image: '',
    activeImage: '',
    text: '',
    url: ''
  }
]
export default function index() {
  return (
    <View className={classes.index}>
      {
        tabs.map(ele => (
          <View>
            <Image src={ele.image} />
            <View>{ele.text}</View>
          </View>
        ))
      }
    </View>
  )
}
