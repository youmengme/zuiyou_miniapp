import Qs from 'query-string'
import { get } from '../utils/request'

interface Hero {
  heroEngName: string
  heroID: string
  name: string
  photoUrl: string
}

export function getHeroes() {
  return get<Array<Hero>>(`/heroes`, {})
}

export async function getPositions() {
  const data = [
    {
      name: '射手',
      key: 'shooter'
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
      key: 'auxiliary',
      name: '辅助'
    }
  ]
  return {
    code: 0,
    data,
    msg: 'success'
  }
}

export async function getHeroPositionMapping() {
  const data = {
    shooter: [
      'sunshangxiang',
      'direnjie',
      'yuji',
      'jialuo',
      'bailishouyue',
      'houyi',
      'liyuanfang',
      'lubanqihao',
      'chengjisihan',
      'ailin',
      'gongsunli',
      'huangzhong',
      'mengya',
      'makeboluo'
    ],
    tank: [
      'zhongwuyan',
      'xiangyu',
      'kai',
      'chengyaojin',
      'lianpo',
      'xiahoudun',
      'baiqi',
      'sunce',
      'lvbu',
      'zhuangzhou',
      'donghuangtaiyi',
      'yase',
      'miyue',
      'liushan',
      'dunshan',
      'change',
      'damo',
      'zhubajie',
      'niumo',
      'mengtian',
      'taiyizhenren',
      'sulie',
      'zhangfei',
      'aguduo',
      'liubang'
    ],
    warrior: [
      'caocao',
      'chengyaojin',
      'damo',
      'xialuote',
      'sikongzhen',
      'yunying',
      'dianwei',
      'guanyu',
      'huamulan',
      'juyoujing',
      'mengqi',
      'kai',
      'kuangtie',
      'laofuzi',
      'lixin',
      'liubei',
      'luna',
      'lvbu',
      'fei',
      'machao',
      'mengtian',
      'mozi',
      'nezha',
      'pangu',
      'peiqinhu',
      'sulie',
      'sunce',
      'sunwukong',
      'xiahoudun',
      'yadianna',
      'yase',
      'yangjian',
      'yao',
      'yunzhongjun',
      'zhaoyun',
      'zhongwuyan',
      'gongbenwuzang'
    ],
    assassin: [
      'zhugeliang',
      'ake',
      'bailishouyue',
      'bailixuance',
      'buzhihuowu',
      'yunying',
      'diaochan',
      'hanxin',
      'huamulan',
      'jing',
      'juyoujing',
      'lanlingwang',
      'libai',
      'lan',
      'fei',
      'machao',
      'nakelulu',
      'peiqinhu',
      'shangguanwaner',
      'sunwukong',
      'yuange',
      'yunzhongjun',
      'zhaoyun',
      'simayi'
    ],
    magus: [
      'anqila',
      'bianque',
      'buzhihuowu',
      'change',
      'daji',
      'sikongzhen',
      'diaochan',
      'ganjiangmoye',
      'gaojianli',
      'jiangziya',
      'mengqi',
      'jinchan',
      'luna',
      'milaidi',
      'moyue',
      'mozi',
      'nvwa',
      'shangguanwaner',
      'shenmengxi',
      'sunbin',
      'wangzhaojun',
      'xishi',
      'xiaoqiao',
      'yangyuhuan',
      'yixing',
      'yingzheng',
      'zhangliang',
      'zhenji',
      'zhongkui',
      'zhouyu',
      'zugeliang',
      'simayi',
      'wuzetian',
      'zhugeliang',
    ],
    auxiliary: [
      'aguduo',
      'caiwenji',
      'daqiao',
      'donghuangtaiyi',
      'dunshan',
      'guiguzi',
      'liushan',
      'lubandashi',
      'mingshiyin',
      'niumo',
      'sunbin',
      'taiyizhenren',
      'yao',
      'zhangfei',
      'zhongkui',
      'zhuangzhou'
    ]
  }
  return {
    code: 0,
    data,
    msg: 'success'
  }
}

export interface RankRes {
  provinceRankList: RankList[];
  cityRankList:     RankList[];
  distinctRankList: RankList[];
}

export interface RankList {
  province: string;
  areaname: string;
  rank:     string;
  city:     string;
  district: string;
  num:      number;
}

export type Platform = 'aqq' | 'iqq' | 'awx' | 'iwx'
export async function getRankListByHeroId(heroId: string, platform: Platform) {
  return get<RankRes>(
    `/heroes/ranks?${Qs.stringify({
      heroId,
      platform,
    })}`,
    {}
  )
}

export type HeroDetail = Hero & {positions: string[]}
export async function getHeroDetail(heroId: string) {
  return get<HeroDetail>(
    `/heroes/${heroId}`,
    {}
  )
}


export interface Position {
  key: string
  name: string
}
