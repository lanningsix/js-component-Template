import axios from 'axios'

const envConfig = {
  LOCAL: 'http://172.16.253.101:8168',
  DEV: 'http://172.16.253.101:8168',
  TEST: 'http://172.16.51.18:8168',
  PRE: 'http://gw-pre.61info.cn',
  PROD: ''
}

let env = 'PROD'

// 创建axios实例
const request = axios.create({
  baseURL: envConfig[env], // api 的 base_url
  timeout: 20000, // 请求超时时间
  // transformRequest: [function (data) {
  //   let ret = ''
  //   for (const it in data) {
  //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  //   }
  //   return ret
  // }],
  // headers: {
  //   'Content-Type': 'application/json'
  // }
})

// response 拦截器
request.interceptors.response.use(
  response => response.data,
  error => {}
)

export {
  request
}

