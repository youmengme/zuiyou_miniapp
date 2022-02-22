import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { Image, ScrollView, Text, View } from '@tarojs/components'
import SystemHeader from '../../components/SystemHeader'
import Header from '../../components/Header'
import Tabbar from '../../components/Tabbar'
import { useElementMoveToHorizontalCenter, useRenderFinished } from '../../hooks/view'
import { useCustomHeader } from '../../hooks/device'
import { getHeroes, getHeroPositionMapping, getPositions } from '../../api/hero'
import { getElementBoundingClientRect, pageScrollToSelector } from '../../utils/native/dom'
import { navigateTo, routes } from '../../routes'
import { Loading } from '../../utils/Toast'
import { hours } from '../../constants'

import classes from './index.module.scss'

interface Position {
  key: string
  name: string
}

interface Hero {
  letter: string
  name: string
  avatar: string
  id: string
  positions: string[]
}

interface HeroLetterGroup {
  letter: string
  list: Array<Hero>
}

function Index() {
  const { scrollLeft, move } = useElementMoveToHorizontalCenter()
  const { height: customHeaderHeight } = useCustomHeader()
  const [countHeight, setCountHeight] = useState(0)
  const [currentGroup, setCurrentGroup] = useState('')
  const [currLetter, setCurrentLetter] = useState('')

  useRenderFinished(
    async () => {
      const data = await getElementBoundingClientRect(`.${classes.groupsBar}`)
      setCountHeight((customHeaderHeight || 0) + (data?.height || 0) - 1)
    },
    {
      selector: `.${classes.groupsBar}`
    }
  )
  const { data: heroesRes, isLoading: isHerosLoading } = useQuery(
    ['HEROES'],
    getHeroes,
    {
      staleTime: hours(2),
      onSettled: () => Loading.close(),
    }
  )
  useEffect(() => {
    if (isHerosLoading) Loading()
  }, [isHerosLoading])

  const { data: positionsRes } = useQuery(
    ['HEROES_POSITIONS'],
    getPositions,
    {
      staleTime: 1000 * 60 * 60
    }
  )
  const { data: mappingRes } = useQuery(
    ['HEROES_MAPPINGS'],
    getHeroPositionMapping,
    {
      staleTime: 1000 * 60 * 60
    }
  )

  const positions = useMemo(() => {
    if (!positionsRes?.data?.length) return []
    return [
      {
        key: 'all',
        name: '全部'
      },
      ...positionsRes?.data
    ]
  }, [positionsRes?.data])
  useEffect(() => {
    if (!!positions?.length) setCurrentGroup(positions[0]?.key)
  }, [positions])

  const positionsMapping = useMemo(() => {
    return positions.reduce((prev, curr) => {
      prev[curr.key] = curr
      return prev
    }, {} as Record<string, Position>)
  }, [positions])

  const mappings = useMemo(() => {
    return Object.keys(mappingRes?.data || {}).reduce((prev, curr) => {
      (mappingRes?.data?.[curr] || []).forEach(ele => {
        if (!prev[ele]) prev[ele] = []
        prev[ele].push(curr)
        prev[ele].sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
      })
      return prev
    }, {} as Record<string/*英雄英文名*/, Array<string/*英雄定位职业*/>>)
  }, [mappingRes?.data])

  const heroes = useMemo<Array<Hero>>(
    () => (heroesRes?.data || []).map(ele => {
      const { heroEngName, heroID, name, photoUrl } = ele
      return {
        name,
        avatar: photoUrl,
        id: heroID,
        letter: heroEngName[0].toUpperCase(),
        positions: mappings[heroEngName] || []
      }
    }).sort(
      (a, b) => a.letter.charCodeAt(0) - b.letter.charCodeAt(0)
    ),
    [heroesRes?.data, mappings]
  )

  const currentHeroes = useMemo(
    () => {
      if (!currentGroup || currentGroup === 'all') return heroes
      return heroes.filter(ele => ele.positions.includes(currentGroup))
    },
    [heroes, currentGroup])

  const currentLetters = useMemo(() => (
    Array.from(currentHeroes
      .reduce((prev, curr) => {
        prev.add(curr.letter)
        return prev
      }, new Set<string>()))
      .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
  ), [currentHeroes])

  const heroLetterGroups = useMemo<Array<HeroLetterGroup>>(() => {
    const obj = currentHeroes.reduce((prev, curr) => {
      if (!prev) prev = {} as HeroLetterGroup
      if (!prev[curr.letter]) {
        prev[curr.letter] = {
          letter: curr.letter,
          list: []
        }
      }
      prev[curr.letter].list.push(curr)
      return prev
    }, {} as HeroLetterGroup)
    return Object.values(obj)
  }, [currentHeroes])

  const handleRegionClick = useCallback((group: string) => {
      setCurrentGroup(group)

      Taro.pageScrollTo({ scrollTop: 0 })
      move(`.${classes.regions}`, `group-${group}`)
    },
    [setCurrentGroup, move])

  const handleGotoLetter = useCallback((selectorId: string) => {
    setCurrentLetter(selectorId)

    pageScrollToSelector(
      `#letter-${selectorId}`,
      { top: countHeight }
    )
  }, [countHeight])

  const toDetail = useCallback((item: Hero) => {
    navigateTo(routes.Hero.Detail(item.id))
  }, [])

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
        className={classes.groupsBar}
        style={{
          top: `${customHeaderHeight}px`
        }}
        id='groups-bar'
      >
        <ScrollView
          scrollLeft={scrollLeft}
          className={classes.groups}
          scrollX
          enableFlex
          scrollWithAnimation
        >
          {
            positions.map((group) => (
              <View
                key={group.key}
                className={
                  classNames(
                    classes.group,
                    { [classes.active]: group.key === currentGroup }
                  )
                }
                id={`group-${group.key}`}
                onClick={() => handleRegionClick(group.key!)}
              >
                {group.name}
              </View>
            ))
          }
        </ScrollView>
      </View>
      <View className={classes.main}>
        {
          heroLetterGroups.map((ele) => (
            <View className={classes.letterGroup}>
              <View
                id={`letter-${ele.letter}`}
                className={classes.letter}
                style={{
                  top: `${countHeight}px`
                }}
              >
                {ele.letter}
              </View>
              <View className={classes.letterBox}>
                {
                  ele.list.map((item) => (
                    <View className={classes.item} onClick={() => toDetail(item)}>
                      <View className={classes.heroInfo}>
                        <Image src={item.avatar} className={classes.avatar} />
                        <Text className={classes.name}>
                          {item.name}
                        </Text>
                      </View>
                      <View className={classes.positions}>
                        {
                          item.positions.map(val => (
                            <Text
                              key={val}
                              className={classNames(
                                classes.position,
                                classes[val]
                              )}
                            >
                              {positionsMapping?.[val]?.name}
                            </Text>
                          ))
                        }
                      </View>
                    </View>
                  ))
                }
              </View>
            </View>
          ))
        }
      </View>

      <View className={classes.IndexBox}>
        {
          currentLetters.map(ele => (
            <Text
              className={
                classNames(classes.indexLetter,
                  { [classes.active]: currLetter === ele }
                )
              }
              onClick={() => handleGotoLetter(ele)}
            >
              {ele}
            </Text>
          ))
        }
      </View>

      <Tabbar />
    </View>
  )
}

export default Index
