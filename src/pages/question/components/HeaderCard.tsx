import React from 'react'
import { View } from '@tarojs/components'
import SystemHeader from '../../../components/SystemHeader'
import Header from '../../../components/Header'
import Icon from '../../../components/Icon'

import classes from './HeaderCard.module.scss'

interface Props {
  onSearch: () => void
}

export default function HeaderCard(props: Props) {
  const { onSearch } = props

  return (
    <>
      <View className={classes.headerBox}>
        <SystemHeader
          pageStartFromZero
          className={classes.header}
        />
        <Header
          pageStartFromZero
          className={classes.header}
        >
          <View className={classes.headerMain}>
            <View className={classes.left}>
              <Icon icon='Func' className={classes.menuIcon} />
            </View>
            <View className={classes.content} />
          </View>
        </Header>
      </View>

      <View className={classes.card}>
        <View className={classes.textArea}>
          <View className={classes.firstLine}>梗查查</View>
          <View className={classes.lastLine}>u1s1, 查梗还得梗查查</View>
        </View>
        <View className={classes.searchBox}>
          <Icon
            icon='Search'
            color='#777'
            className={classes.searchIcon}
          />
          <View
            className={classes.searchInput}
            onClick={onSearch}
          >
            请输入要搜索的关键字
          </View>
        </View>
      </View>
    </>
  )
}
