import Router from 'koa-router';
import fetch from 'node-fetch';
import sendFile from 'koa-sendfile';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from '../src/reducers';
import App from '../src/components/App';

async function getTitle(url) {
  let response = await fetch(url);
  let html = await response.text();
  return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}

const generatePage = (content, state, options = {
  title: 'SSR Demo',
}) => `
<!DOCTYPE html>
<html>
  <head>
    <title>${options.title}</title>
  </head>
  <body>
    <div id="root">${content}</div>
    <script>window.__INITIAL_STATE__ = ${JSON.stringify(state)};</script>
    <script src="/static/bundle.js"></script>
  </body>
</html>
`;

export default (app) => {
    const router = new Router();
    router.get("/", async (ctx, next) => {
        // const awaitVal = await new Promise(function (resolve, reject) {
        //     setTimeout(function() {
        //       ctx.body = {
        //         msg: 'promises!'
        //       };
        //       console.log('promises')
        //       resolve('pro resolve');
        //     }, 1000);
        //   });
        // console.log(awaitVal);
        const title = await getTitle('http://www.ruanyifeng.com/blog/2016/05/react_router.html');
        const body = await getTitle('https://github.com/alexmingoia/koa-router/blob/koa2-async-tests/test/lib/router.js');

        ctx.body = {
            msg: title,
            body: body
        };

        // throw new Error('boom boom');
    })

    router.get("/index", async (ctx, next) => {
        const status = await sendFile(ctx, 'views/index.html');
        if (!ctx.status) {
            ctx.throw(404);
        };
    })


    router.get("/isomor", async (ctx, next) => {

        const title = await getTitle('http://www.ruanyifeng.com/blog/2016/05/react_router.html');

        let initialState = {
            todos: [{
                id: 0,
                completed: false,
                text: title
            }],
            visibilityFilter: "SHOW_ALL"
        };

        let store = createStore(todoApp, initialState);

        const content = renderToString(
            <Provider store={store}>
                <App />
            </Provider>
        );

        ctx.body = generatePage(content, store.getState());
    });


    app.use(router.routes());
}


