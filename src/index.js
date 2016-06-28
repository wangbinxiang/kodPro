import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from './reducers';
import App from './components/App';
import fetch from 'isomorphic-fetch';


let store = createStore(todoApp, window.__INITIAL_STATE__);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);


// webpack entry 添加 babel-polyfill 客户端就可以使用async
// async function getTitle(url) {
//   let response = await fetch(url);
//   let html = await response.text();
//   return html.match(/<title>([\s\S]+)<\/title>/i)[1];
// }


// async function title () {
//     const title = await getTitle('/index');
//     console.log(title);
// }
// title();