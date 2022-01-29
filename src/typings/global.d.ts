declare interface Response<T = object> {
  code: number
  data: T
  message: string
}
