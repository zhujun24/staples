import querystring from 'querystring'
import fetch from './fetch'
import { actionTypeCreator, ajaxActionTypeCreator } from 'constants/action-types'

const syncActionCreator = type => {
  actionTypeCreator(type)
  return data => ({ type, data })
}

const asyncActionCreator = (actionType = '', { url, method = 'GET' }) => {
  ajaxActionTypeCreator(actionType)
  return (
    {
      pathSuffix = '',
      searchData = {}, // 搜索参数，即`path`中问号的内容
      headerData = {}, // 额外多加的头部
      formData = {}, // 表单参数
      injectData = {}, // 注入参数
      startData = {}, // 请求开始注入数据
      successData = {}, // 请求成功注入数据
      errorData = {}, // 请求失败注入数据
      afterStart = () => {} // 请求发出前执行
    } = {}
  ) => {
    return dispatch => {
      dispatch(fetchStart())
      afterStart()
      return fetch[method.toLowerCase()](`/api${url}${pathSuffix}?${querystring.stringify(searchData)}`, { headerData, formData })
        .then(response => {
          if (response && response.code === 0) {
            dispatch(fetchSuccess(response.response))
            return response.response
          } else {
            console.log('Sync Data Error')
            dispatch(fetchError(null))
            return null
          }
        })
        .catch(error => {
          dispatch(fetchError(error))
          throw error
        })
    }

    function fetchStart () {
      return {
        type: `${actionType}_START`,
        data: {
          isFetching: true,
          ...injectData,
          ...startData
        }
      }
    }

    function fetchSuccess (response) {
      return {
        type: `${actionType}_SUCCESS`,
        data: {
          response,
          isFetching: false,
          ...injectData,
          ...successData
        }
      }
    }

    function fetchError (error) {
      return {
        type: `${actionType}_ERROR`,
        data: {
          error,
          isFetching: false,
          ...injectData,
          ...errorData
        }
      }
    }
  }
}

export default {
  async: asyncActionCreator,
  sync: syncActionCreator
}
