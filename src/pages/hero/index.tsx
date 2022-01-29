import React, { useCallback, useState } from 'react'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { ScrollView, View } from '@tarojs/components'
import SystemHeader from '../../components/SystemHeader'
import Header from '../../components/Header'
import { useElementMoveToHorizontalCenter } from '../../hooks/view'
import { getElementBounding } from '../../utils/native/dom'

import classes from './index.module.scss'

const groups = [
  {
    key: 'all',
    name: '全部'
  },
  {
    key: 'tank',
    name: '坦克'
  },
  {
    key: 'warrior',
    name: '战士'
  },
  {
    key: 'assassin',
    name: '刺客'
  },
  {
    key: 'magus',
    name: '法师'
  },
  {
    key: 'shooter',
    name: '射手'
  },
  {
    key: 'auxiliary',
    name: '辅助'
  }
]
function Index() {
  const { scrollLeft, move } = useElementMoveToHorizontalCenter()
  const [ currentGroup, setCurrentGroup ] = useState('')
  const handleRegionClick = useCallback((group: string) => {
      setCurrentGroup(group)

      async function scrollToRegions() {
        const bounding = await getElementBounding(`#${classes.stores}`)
        const regionBounding = await getElementBounding('#groups-bar')
        Taro.pageScrollTo(
          { scrollTop: bounding.offsetTop - regionBounding.height - 1 },
        )
      }
      move(`.${classes.regions}`, `group-${group}`)
      scrollToRegions()
    },
    [setCurrentGroup, move])
  return (
    <View className={classes.wrapper}>
      <View className={classes.headerBox}>
        <SystemHeader
          sticky
          className={classes.header}
        />
        <Header
          sticky
          title='王者战力'
          titleColor='#fff'
          className={classes.header}
        />
      </View>
      <View
        className={classes.regionsBar}
        id='groups-bar'
      >
        <ScrollView
          scrollLeft={scrollLeft}
          className={classes.groups}
          scrollX
          enableFlex
          scrollWithAnimation
        >
          {groups.map((group) => (
            <View
              key={group.key}
              className={
                classNames(
                  classes.group,
                  { [classes.active]: group.key === currentGroup },
                )
              }
              id={`group-${group.key}`}
              onClick={() => handleRegionClick(group.key!)}
            >
              {group.name}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

export default Index
