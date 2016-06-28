import fetch from 'isomorphic-fetch';
import * as types from '../constants/ActionTypes';

let nextTodoId = 1;
export const addTodo = (text) => {
    // const t = getTitle('/index');
    // console.log(t);
    return {
        type: types.ADD_TODO,
        id: nextTodoId++,
        text
    }
}

export const setVisibilityFilter = (filter) => {
    return {
        type: types.SET_VISIBILITY_FILTER,
        filter
    }
}

export const toggleTodo = (id) => {
    return {
        type: types.TOGGLE_TODO,
        id
    }
}

export const requestTodoId = () => {
    return {
        type: types.REQUEST_TODO_ID
    }
}

export const receiveTodoId = (id) => {
    return {
        type: types.RECEIVE_TODO_ID,
        id
    }
}

async function getTitle(url) {
  let response = await fetch(url);
  let html = await response.text();
  return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}

async function fetchTodoId() {
    return (dispatch) => {
        dispatch(requestTodoId());
        return fetch().then((response) => { 
            return response.json();
        }).then((json) => {
            dispatch(receiveTodoId(json));
        });
    }
}