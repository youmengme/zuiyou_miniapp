import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { useQuery } from 'react-query'
import { Image, Text, View } from '@tarojs/components'
import { getHeroDetail, getPositions, getRankListByHeroId, Platform, Position } from '../../api/hero'
import { hours, seconds } from '../../constants'
import { useQueryString } from '../../hooks'
import { navigateBack } from '../../routes'
import SystemHeader from '../../components/SystemHeader'
import Header from '../../components/Header1'
import { useCustomHeader } from '../../hooks/device'
import { Toast } from '../../utils/Toast'
import Icon from '../../components/Icon'
import { getCookieSync, setCookie } from '../../utils/cookie'
import IPlatform from '../../assets/icons/platform.svg'

import classes from './detail.module.scss'

const sheets = [
  ['iOS', '微信'],
  ['iOS', 'QQ'],
  ['Android', '微信'],
  ['Android', 'QQ']
]
const tabs = [
  {
    name: '省榜',
    key: 'province'
  },
  {
    name: '市榜',
    key: 'city'
  },
  {
    name: '区榜',
    key: 'region'
  }
]

export default function Detail() {
  const { id } = useQueryString<{ id: string }>()
  const { height } = useCustomHeader()
  useEffect(
    () => {
      if (!id) navigateBack()
    },
    [id]
  )

  const [currTab, setCurrTab] = useState('province')
  const [env, setEnv] = useState(getCookieSync('chosenEnv') || sheets[0][0])
  const [platform, setPlatform] = useState(getCookieSync('chosenPlatform') || sheets[0][1])

  const rankPlatform = useMemo(
    () => {
      const em = {
        iOS: 'i',
        Android: 'a'
      }
      const pm = {
        '微信': 'wx',
        'QQ': 'qq'
      }
      if (!em[env] || !pm[platform]) return null
      return `${em[env]}${pm[platform]}`
    },
    [env, platform]
  )

  const {
    data: rankListRes,
    isLoading: isRankingLoading
  } = useQuery(
    ['RANK_CACHE', {
      id,
      platform: rankPlatform
    }],
    () => getRankListByHeroId(id!, rankPlatform as Platform),
    {
      enabled: Boolean(id && ['aqq', 'iqq', 'awx', 'iwx'].includes(rankPlatform!)),
      staleTime: seconds(5)
    }
  )

  const { data: heroDetailRes } = useQuery(
    ['HERO_DETAIL', id],
    () => getHeroDetail(id!),
    {
      enabled: Boolean(id),
      staleTime: hours(2)
    }
  )

  const heroDetail = useMemo(
    () => heroDetailRes?.data || null,
    [heroDetailRes]
  )

  const provinceRankList = useMemo(() => {
    if (!rankListRes?.data) return []
    return rankListRes?.data?.provinceRankList || []
  }, [rankListRes?.data])

  const cityRankList = useMemo(() => {
    if (!rankListRes?.data) return []
    return rankListRes?.data?.cityRankList || []
  }, [rankListRes?.data])

  const regionListRes = useMemo(() => {
    if (!rankListRes?.data) return []
    return rankListRes?.data?.distinctRankList || []
  }, [rankListRes?.data])

  const provinceMinRank = useMemo(
    () => {
      const nums = provinceRankList
        .filter(ele => Boolean(Number(ele.rank)))
        .map(ele => +ele.rank)

      return nums?.length ? Math.min(...nums) : '暂无数据'
    },
    [provinceRankList]
  )
  const cityMinRank = useMemo(
    () => {
      const nums = cityRankList
        .filter(ele => Boolean(Number(ele.rank)))
        .map(ele => +ele.rank)

      return nums?.length ? Math.min(...nums) : '暂无数据'
    },
    [cityRankList]
  )
  const regionMinRank = useMemo(
    () => {
      const nums = regionListRes
        .filter(ele => Boolean(Number(ele.rank)))
        .map(ele => +ele.rank)

      return nums?.length ? Math.min(...nums) : '暂无数据'
    },
    [regionListRes]
  )

  const mapping = useMemo(
    () => {
      return {
        province: provinceRankList,
        city: cityRankList,
        region: regionListRes
      }
    },
    [
      cityRankList,
      provinceRankList,
      regionListRes
    ]
  )

  const list = useMemo(
    () => {
      return mapping[currTab]
    },
    [currTab, mapping]
  )
  const { data: positionsRes } = useQuery(
    ['HEROES_POSITIONS'],
    getPositions,
    {
      staleTime: 1000 * 60 * 60
    }
  )
  const positions = useMemo(() => {
    if (!positionsRes?.data?.length) return []
    return positionsRes?.data
  }, [positionsRes?.data])
  const positionsMapping = useMemo(() => {
    return positions.reduce((prev, curr) => {
      prev[curr.key] = curr
      return prev
    }, {} as Record<string, Position>)
  }, [positions])
  const sheetList = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    () => sheets.map(([env, platform]) => `${env} • ${platform}`),
    []
  )
  const handleSubscription = useCallback(() => {
    Toast('功能开发中，下个版本实现...')
  }, [])

  const handleChangePlatform = useCallback(() => {
    Taro
      .showActionSheet({ itemList: sheetList })
      .then((ele) => {
        const [selectedEnv, selectedPlatform] = sheets[ele.tapIndex]
        setEnv(selectedEnv)
        setPlatform(selectedPlatform)
        setCookie('chosenEnv', selectedEnv)
        setCookie('chosenPlatform', selectedPlatform)
      })
  }, [sheetList])

  return (
    <View className={classes.detail}>
      <View className={classes.headerBox}>
        <SystemHeader sticky />
        <Header
          sticky
          onBackAction={() => navigateBack()}
        >
          <View
            className={classes.content}
            onClick={handleChangePlatform}
          >
            <Image src={IPlatform} className={classes.icon} />
            <Text className={classes.envName}>{env} • {platform}</Text>
            <Icon icon='TriangleDown' className={classes.downIcon} />
          </View>
        </Header>
      </View>
      <View className={classes.cardBox}>
        <View className={classes.card}>
          <View className={classes.info}>
            {
              heroDetail
                ? (
                  <View className={classes.avatarBox}>
                    <Image
                      src={heroDetail?.photoUrl}
                      className={classes.avatar}
                    />
                    <View className={classes.main}>
                      <View className={classes.name}>
                        {heroDetail?.name}
                      </View>
                      <View className={classes.positions}>
                        {
                          heroDetail?.positions?.map(ele => (
                            <View
                              key={ele}
                              className={classNames(
                                classes.position,
                                classes[ele]
                              )}
                            >
                              {positionsMapping?.[ele]?.name}
                            </View>
                          ))
                        }
                      </View>
                    </View>
                  </View>
                )
                : null
            }
            {
              !isRankingLoading
                ? (
                  <View className={classes.ranks}>
                    <View className={classNames(classes.line)}>
                      <View className={classes.key}>区榜最低：</View>
                      <View className={classes.val}>
                        {regionMinRank}
                      </View>
                    </View>
                    <View className={classNames(classes.line)}>
                      <View className={classes.key}>市榜最低：</View>
                      <View className={classes.val}>
                        {cityMinRank}
                      </View>
                    </View>
                    <View className={classNames(classes.line)}>
                      <View className={classes.key}>省榜最低：</View>
                      <View className={classes.val}>
                        {provinceMinRank}
                      </View>
                    </View>
                  </View>
                )
                : (
                  <View className={classes.loadingRank}>
                    加载中....
                  </View>
                )
            }
          </View>
          {
            10 > 11
              ? (
                <View className={classes.appointment}>
                  <View
                    className={classes.action}
                    onClick={() => handleSubscription()}
                  >
                    订阅更新提醒
                  </View>
                </View>
              )
              : null
          }

        </View>
      </View>
      <View
        className={classes.tabs}
        style={{ top: `${height}px` }}
      >
        {
          tabs.map((ele) => (
            <View
              className={classNames(
                classes.tab,
                { [classes.active]: ele.key === currTab })
              }
              onClick={() => setCurrTab(ele.key)}
            >
              {ele.name}
            </View>
          ))
        }
      </View>
      <View className={classes.list}>
        {
          list.map((item) => (
            <View className={classes.item}>
              <View className={classes.cityName}>
                {
                  item.province && item.province !== '-'
                    ? (
                      <Text className={classes.province}>
                        {item.province}
                      </Text>
                    )
                    : null
                }
                {
                  item.city && item.city !== '-' && currTab !== 'province'
                    ? (
                      <Text className={classes.city}>
                        {item.city}
                      </Text>
                    )
                    : null
                }
                {
                  item.district && item.district !== '-' && currTab === 'region'
                    ? (
                      <Text className={classes.district}>
                        {item.district}
                      </Text>
                    )
                    : null
                }
              </View>
              <View className={classes.rank}>
                {item.rank || <View className={classes.none}>暂无数据</View>}
              </View>
            </View>
          ))
        }
      </View>
    </View>
  )
}
