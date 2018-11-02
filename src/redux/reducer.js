import { SET_USER, SET_CONTENT, SET_LANGUAGE } from './types'

const initialState = {
  user:null,
  content:null,
  contentLoaded:false,
  language:'sk'
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:{
      return { ...state, user:action.user };
    }
    case SET_CONTENT:{
      return { ...state, content:action.content, contentLoaded:true };
    }
    case SET_LANGUAGE:{
      return { ...state, language:action.language };
    }
    default:
      return state;
  }
}
