import { SUCESSFULL_LOGIN } from '../types/types'

let initialState = {
   loginSucess : ''
}

export default (state = initialState, action) => {
   switch (action.type) {
       case SUCESSFULL_LOGIN:
           return { ...state, loginSucess: action.payload.data }
       default:
           return state
   }
}