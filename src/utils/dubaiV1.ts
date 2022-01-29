import HttpClient from './native/http'

const dubai = new HttpClient((option) => {
  option.header!['AC-Timestamp'] = Math.floor(Number(new Date()) / 1000)
  option.header!['AC-App-Id'] = '10001'
}, process.env.DUBAI_API)

export default dubai
