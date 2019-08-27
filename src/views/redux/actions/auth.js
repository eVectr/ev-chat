import { SUCESSFULL_LOGIN } from '../types/types';

export const sucessfullLogin = (data) => {
   return {
       type: SUCESSFULL_LOGIN,
       payload:{
           data
       }
   }
}