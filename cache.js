/*
* 将操作localStorage的方法 抽象出来 可直接满足业务需求
*/

const localStorage = window.localStorage
const defaultExpire = 86400000 * 5 // 默认有效期5天

export default {

  // expire 毫秒单位
  setItem ( key, value, expire ) {
    if ( value === undefined || value === null )
      return false

    if ( expire === undefined )
      expire = defaultExpire

    key = `__app__${key}__cache__`
    let data = {
      value: value,
      expire: parseInt ( new Date ().getTime () ) + parseInt ( expire )
    }

    localStorage.setItem ( key, JSON.stringify ( data ) )
  },

  getItem ( key ) {
    key = `__app__${key}__cache__`
    if ( localStorage.getItem ( key ) == null )
      return null

    let cache = localStorage.getItem ( key )
    try {
      cache = JSON.parse ( cache )
    } catch ( e ) {
      console.warn ( '读取缓存转换object，缓存数据被修改过!!!' )
      return null
    }

    if ( !cache || !cache['expire'] || !cache['value'] )
      return null

    let {value, expire} = cache
    if ( parseInt ( expire ) < parseInt ( new Date ().getTime () ) ) {
      localStorage.removeItem ( key )
      return null
    }

    return value
  },

  removeItem ( key ) {
    key = `__app__${key}__cache__`
    localStorage.removeItem ( key )
  }
}
