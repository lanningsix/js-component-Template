import CommonTemplate from '../../src/index'

let a = new CommonTemplate()

let ahandle = function loginHandle(e: any) {
  console.log(e)
}

a.on('login', ahandle)

// a.off('login', ahandle)