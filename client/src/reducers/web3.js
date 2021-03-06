import * as web3 from 'actions/web3'
import addresses from 'constants/addresses'

export default (state = {addresses}, action) => {
  switch (action.type) {
    case web3.SET_READY_STATUS:
      return {...state, ...action.response}
    case web3.SELECT_ACCOUNT:
      return {...state, ...action.response}
    case web3.GET_NETWORK_TYPE.SUCCESS:
      return {...state, ...action.response}
    default:
      return state
  }
}
