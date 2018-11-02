import { SET_USER, SET_CONTENT, SET_LANGUAGE } from './types';

export const setUser = (user) => {
  return (dispatch) => {
    dispatch({ type: SET_USER, user });
  }
};

export const setContent = (content) => {
  return (dispatch) => {
    dispatch({ type: SET_CONTENT, content });
  }
};

export const setLanguage = (language) => {
  return (dispatch) => {
    dispatch({ type: SET_LANGUAGE, language });
  }
};
