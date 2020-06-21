// 根据key获取url上的参数value
function getQueryString (key) {
  let search = window.location.href
  if (search.indexOf('?') === -1) return '' // 如果url中没有传参直接返回空

  // key存在先通过search取值如果取不到就通过hash来取
  search = location.search.substr(1) || window.location.hash.split('?')[1]
  if (search) {
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
    const matchArr = search.match(reg)
    if (matchArr != null) {
      return decodeURIComponent(matchArr[2])
    } else {
      return ''
    }
  }
}

export { getQueryString }
