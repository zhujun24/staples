import ActionTypes from 'constants/action-types'

export default (state = {}, action = {}) => {
  const data = action.data
  switch (action.type) {
    // get list
    case ActionTypes.GET_METRICS_START:
      return { ...state, isLoading: true }
    case ActionTypes.GET_METRICS_SUCCESS:
    case ActionTypes.GET_METRICS_ERROR:
      return { ...state, list: data.response, isLoading: false }

    default:
      return state
  }
}
