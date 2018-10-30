/*
* 业务中使用到的将搜索参数以及 分页参数写入query的 一个装饰器 （适用于vue）
*/

import isEqual from 'lodash/isEqual'

class BaseQueryClass {
  pageNo = 1 
  pageSize = 5
}

function BaseQuery ( ) {
  const types = Array.from ( arguments ) || [ 'getList' ]
  return function ( Component ) {
    let result = new BaseQueryClass ()
    Object.defineProperty ( Component.prototype, 'baseQuery', {
      get: function () {
        return result
      },
      set: function ( val ) {
        result = val
        if ( this._isVue ) {
          let oldQuery = this.$route.query
          let query = Object.assign ( {}, this.$route.query, val )
          this.$router.push ( { query: query } )
          console.log(val, oldQuery )
          // location.href = `${location.href.split ( '?' )[0]}?${qs.stringify ( val )}`
          if ( !isEqual ( val, oldQuery ) )
            types.map ( i => {
              this[i] && this[i] ( val )
            } )
        }
      }
    } )
    return Component
  }
}
export default BaseQuery
