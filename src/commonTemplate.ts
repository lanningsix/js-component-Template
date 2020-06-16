import commonLoginConfig from './commonTemplateConfig'
export default class CommonTemplate {
  private def: any = {} // config
  private dom: any = '' // 需要插入的dom
  private hasDom: boolean = false // 当前界面是否有显示dom
  private listeners: any = [] // 自定义事件，用于监听插件的用户交互 
  private handlers: any = {} // 处理函数

  constructor() {
    // 默认参数
    const def = {}
    this.def = Object.assign(this.def, def)
    this.dom = this.parseToDom()[0]
    this.show()
  }

  // 将字符串转为dom
  parseToDom() { 
    var div = document.createElement('div')
    div.innerHTML = commonLoginConfig.innerHTML
    return div.childNodes
  }

  // 显示函数
  show(callback?: any) {
    if (this.hasDom) return
    document.body.appendChild(this.dom)
    this.hasDom = true

    this.dom.getElementsByClassName('login_btn')[0].onclick = () => {
      if (this.listeners.indexOf('login') > -1) {
        this.emit({ type: 'login', target: this.dom })
        return
      }
      console.log('CommonLoginSDK -> this.dom.getElementsByClassName -> 已点击登录按钮, 无父事件触发')
    }
    callback && callback()
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


}