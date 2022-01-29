import React, { useEffect, useMemo, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import Taro, { useReachBottom } from '@tarojs/taro'
import { Input, View } from '@tarojs/components'

import { navigateBack } from '../../routes'
import { searchWikis } from '../../api'

import SystemHeader from '../../components/SystemHeader'
import Header from '../../components/Header'
import Icon from '../../components/Icon'
import Card from './components/Card'

import classes from './search.module.scss'

const Index = () => {
  const [kw, setKw] = useState('')
  const {
    data: wikisRes,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery(
    'SEARCH_QUESTION',
    () => searchWikis(kw),
    {
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
      },
      enabled: Boolean(kw)
    })
  useEffect(
    () => {
      refetch()
    },
    [kw, refetch]
  )
  const wikis = useMemo(() => {
    return wikisRes?.pages?.map(page => page.data.list).flat() || []
  }, [wikisRes?.pages])

  useReachBottom(() => {
    if (hasNextPage) fetchNextPage()
  })
  return (
    <View className={classes.wrapper}>
      <View className={classes.headerBox}>
        <SystemHeader
          sticky
          className={classes.header}
        />
        <Header
          sticky
          className={classes.header}
        >
          <View className={classes.headerMain}>
            <View
              className={classes.back}
              onClick={() => navigateBack()}
            >
              <Icon icon='ArrowLeft' />
            </View>
            <View className={classes.content}>
              <Input
                className={classes.searchInput}
                focus
                confirmType='search'
                placeholder='请输入要搜索的关键字'
                onConfirm={() => refetch()}
                onBlur={() => refetch()}
                onInput={(event) => setKw(event.detail.value)}
              />
              <Icon
                icon='Search'
                className={classes.searchIcon}
                color='#555'
              />
            </View>
          </View>
        </Header>
      </View>
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
  )
}

export default Index
