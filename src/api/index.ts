import { get } from '../utils/request'

interface Wiki {
  id: number
  name: string
  title: string
  desc: string
  imgs: Array<string>
}

interface Member {
  name: string
  avatar: string
}

interface Wikis {
  wiki: Wiki,
  member: Member
}

interface WikiResult {
  list: Array<Wikis>
  score: number
  more: boolean
}

export function getWikis(score: number = 0) {
  return get<WikiResult>(`/zuiyou/${score}`, {})
}

export function searchWikis(kw: string) {
  return get<WikiResult>(`/zuiyou/search/${kw}`, {})
}
