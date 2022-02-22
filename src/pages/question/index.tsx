import React, { useEffect, useMemo } from 'react'
import Taro, { useReachBottom } from '@tarojs/taro'
import { useInfiniteQuery } from 'react-query'
import { View } from '@tarojs/components'
import HeaderCard from './components/HeaderCard'
import Card from './components/Card'
import { getWikis } from '../../api'
import Tabbar from '../../components/Tabbar'
import { navigateTo, routes } from '../../routes'

import classes from './index.module.scss'

const fetchProjects = ({ pageParam = 0 }) => getWikis(pageParam)

function Index() {
  const {
    data: wikisRes,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage
  } = useInfiniteQuery('projects', fetchProjects, {
    keepPreviousData: true,
    getNextPageParam: (lastPage) => (
      lastPage.data.more
        ? lastPage.data.score
        : undefined
    ),
    onSettled: () => {
      Taro.hideLoading()
    },
    onSuccess: () => {
      Taro.hideLoading()
    }
  })


  useReachBottom(() => {
    if (hasNextPage) fetchNextPage()
  })
  useEffect(
    () => {
      if (isFetching) {
        Taro.showLoading({ title: '加载中...' }).then(
          () => {
            setTimeout(
              () => Taro.hideLoading(),
              3000)
          }
        )
      }
    },
    [isFetching]
  )
  const wikis = useMemo(() => {
    return wikisRes?.pages?.map(page => page.data.list).flat() || []
  }, [wikisRes?.pages])

  return (
    <View className={classes.wrapper}>
      <HeaderCard onSearch={() => navigateTo(routes.Question.Search())} />
      <View className={classes.main}>
        {
          wikis.map(ele => (
            <Card data={ele} key={ele.wiki.id} />
          ))
        }
        {
          isFetchingNextPage
            ? (
              <View className={classes.loadingNext}>加载中...</View>
            )
            : null
        }
        {
          !wikis?.length && !isFetching
            ? (
              <View className={classes.searchEmpty}>
                暂时还没收录相关的问题诶~
              </View>
            )
            : null
        }
      </View>
      <Tabbar />
    </View>
  )
}

export default Index
