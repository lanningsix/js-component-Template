import commonLoginConfig from './commonLoginConfig'
import { request } from '../utils/request.js'
import { getQueryString } from '../utils/index.js'
import defaultImg from '../assets/avator.png'
export default class CommonLoginSDK {
  private def: any = {} // config
  private dom: any = '' // 需要插入的dom
  private hasDom: boolean = false // 当前界面是否有显示dom
  private listeners: any = [] // 自定义事件，用于监听插件的用户交互 
  private handlers: any = {} // 处理函数
  private foreachCount: any = 0 //循环次数
  //统一登录地址
  private envConfig: any = {
    'LOCAL': 'http://172.16.51.18:8168',
    'TEST': 'http://172.16.51.18:8168',
    'PRE': 'http://gw-pre.61info.cn',
    'PROD': '//gw.61info.cn'
  }

  private DEVELOPMENT = process.env.NODE_ENV === 'development' ? 'LOCAL' : process.env.NODE_ENV

  constructor() {
    console.log(this.DEVELOPMENT)
  }

  //初始化
  init(opt: object) {
    // 默认参数
    const def = {
      redirectUrl: '',
      success: function () { },
      error: function () { },
      isShow:true
    }
    this.def = Object.assign(def, opt)
    this.dom = this.parseToDom()[0]

    console.log('this.def====>',this.def)
    if(this.def.isShow){
      this.show().changeStatusAndDom(0)
    }
    // 登录成功返回业务页面去拿链接上的token,没有则去localStoran,没有则去localStorage拿
    let userToken = getQueryString('userToken') || localStorage.getItem('hllUserToken')
    let refreshToken = getQueryString('refreshToken') || localStorage.getItem('hllRefreshToken')
    if (userToken && refreshToken) {
      localStorage.setItem('hllUserToken', userToken)
      localStorage.setItem('hllRefreshToken', refreshToken)
      this.queryLoginStatus()
      console.log('CommonLoginSDK -> init -> 获取登录信息')
    } else {
      //未登录状态
      console.log('CommonLoginSDK -> init -> 未登录状态')
      this.def.success({
        loginStatus: '未登录'
      })
    }
  }

  // 将字符串转为dom
  parseToDom() {
    var div = document.createElement('div')
    div.innerHTML = commonLoginConfig.login_html
    return div.childNodes
  }

  // 显示函数
  show() {
    if (this.hasDom) return
    document.body.appendChild(this.dom)
    this.hasDom = true
    console.log('listeners===>', this.listeners)
    this.dom.getElementsByClassName('common-login-bar-login-btn')[0].onclick = () => {
      //跳转统一登录页
      this.loginHandle()
      console.log('CommonLoginSDK -> this.dom.getElementsByClassName -> 已点击登录按钮, 无父事件触发')
    }
    return this
  }

  // 隐藏函数
  hide(callback?: any) {
    document.body.removeChild(this.dom)
    this.hasDom = false
    callback && callback()
  }

  // 用户绑定事件
  on(type: any, handler: any) {
    if (typeof this.handlers[type] === 'undefined') {
      this.handlers[type] = []
    }
    this.listeners.push(type)
    this.handlers[type].push(handler)
  }

  // 用户解绑事件
  off(type: any, handler: any) {
    if (this.handlers[type] instanceof Array) {
      let handlers = this.handlers[type]
      for (var i = 0, len = handlers.length; i < len; i++) {
        console.log(handlers[i])
        console.log(handler)
        console.log(handlers[i] === handler)
        if (handlers[i] === handler) {
          break
        }
      }
      this.listeners.splice(i, 1)
      handlers.splice(i, 1)
    }
  }

  // 触发用户事件
  emit(event: any) {
    if (!event.target) {
      event.target = this
    }
    if (this.handlers[event.type] instanceof Array) {
      let handlers = this.handlers[event.type]
      for (var i = 0, len = handlers.length; i < len; i++) {
        handlers[i](event)
        return true
      }
    }
    return false
  }

  //获取登录信息
  queryLoginStatus() {
    //获取登录信息
    request({
      url: '/user/getUserBasicInfo',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      baseURL: this.envConfig[this.DEVELOPMENT],
      data: {
        userToken: localStorage.getItem('hllUserToken')
      },
      transformRequest: [function (data: any) {
        return JSON.stringify(data)
      }]
    }).then((res: any) => {
      if (res.code === 0) {
        //loginStatus 1  修改dom
        let obj = {
          account: '',
          headUrl: '',
          nickName: ''
        }
        obj.account = res.data.account
        obj.headUrl = res.data.headUrl || defaultImg
        obj.nickName = res.data.nickName
        this.changeStatusAndDom(1, obj)
        this.def.success({
          userToken: localStorage.getItem('hllUserToken'),
          loginStatus: '已登录'
        })
      }
      //userToken过期
      else if (res.code === 621) {
        this.refeshTokenHandle()
      } else {
        //发送错误信息 error loginStatus 0
        this.changeStatusAndDom(0)
        this.def.error(res.msg)
      }
    })
  }

  //重新刷新token
  refeshTokenHandle() {
    request({
      url: '/user/refreshToken',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      baseURL: this.envConfig[this.DEVELOPMENT],
      data: {
        refreshToken: localStorage.getItem('hllRefreshToken')
      },
      transformRequest: [function (data) {
        return JSON.stringify(data)
      }]
    }).then((res: any) => {
      if (res.code === 0) {
        this.foreachCount++
        if (this.foreachCount === 0) {
          //拿到新的token
          localStorage.setItem('hllUserToken', res.data.userToken)
          localStorage.setItem('hllRefreshToken', res.data.refreshToken)
          this.queryLoginStatus()
        } else {
          //发送错误信息 error loginStatus 0
          this.changeStatusAndDom(0)
          this.def.error('获取登录次数达到上限, 请刷新页面重试')
        }
      } else {
        //发送错误信息 error loginStatus 0
        this.changeStatusAndDom(0)
        this.def.error(res.msg)
      }
    })
  }

  // 跳转函数
  loginHandle() {
    console.log('this.def.redirectUrl====>',this.def.redirectUrl)
      window.location.href =
        "http://172.16.83.192:8085/#/login" +
        "?gotoUrl=" + this.def.redirectUrl
  }

  //status 0 未登录 1登录
  changeStatusAndDom(status: number, response: any = {}) {
    const headerImg = document.getElementById('common-login-bar-header-img')
    const loginBtn = document.getElementsByClassName('common-login-bar-login-btn')[0]
    const tel = document.getElementsByClassName('common-login-bar-tel')[0]
    const name = document.getElementsByClassName('common-login-bar-name')[0]
    //未登录
    if (status === 0) {
      headerImg.setAttribute('src', defaultImg)
      loginBtn.innerHTML = '立即登录'
      name.innerHTML = '未登录'
      tel.setAttribute('style', 'display:none')
    } else {
      headerImg.setAttribute('src', response.headUrl)
      loginBtn.innerHTML = '切换账号'
      name.innerHTML = response.nickName
      tel.setAttribute('style', 'display:block')
      tel.innerHTML = response.account
    }
  }
}