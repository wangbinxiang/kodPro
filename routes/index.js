import Router from 'koa-router';
import fetch from 'node-fetch';
import sendFile from 'koa-sendfile';
import ReactDOM from 'react-dom/server';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { RouterContext } from 'react-router';
import todoApp from '../src/reducers';
import App from '../src/components/App';
import Html from '../src/helpers/Html';

import match from '../src/helpers/match';

import createHistory from 'react-router/lib/createMemoryHistory';

import routerCreateStore from '../src/createStore';
import { syncHistoryWithStore } from 'react-router-redux';
import routerRoutes from '../src/routes';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';

async function getTitle(url) {
  let response = await fetch(url);
  let html = await response.text();
  return html.match(/<title>([\s\S]+)<\/title>/i)[1];
}

const generatePage = (content, state, options = {
  title: 'SSR Demo',
}, val) => `
<!DOCTYPE html>
<html>
  <head>
    <title>${options.title}</title>
  </head>
  <body>
    <div id="root">${content}</div>
    <script>window.__INITIAL_STATE__ = ${JSON.stringify(state)};</script>
    <script src="${val.main}"></script>
  </body>
</html>
`;

const hotView = (main) => `
<!DOCTYPE html>
<html>
  <head>
    <title>hot view</title>
  </head>
  <body>
    <div id="content"></div>
    <script src="${main}"></script>
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
        webpackIsomorphicTools.refresh();
        
        const main = webpackIsomorphicTools.assets().javascript.main;

        ctx.body = hotView(main);

        // const status = await sendFile(ctx, 'views/index.html');
        // if (!ctx.status) {
        //     ctx.throw(404);
        // };
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

        // const content = renderToString(
        //     <Provider store={store}>
        //         <App />
        //     </Provider>
        // );
        // ctx.body = generatePage(content, store.getState());

        const component = (
            <Provider store={store}>
                <App />
            </Provider>
        );
        ctx.body = '<!doctype html>\n' +
        ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>);
    });


    router.get('/router', async (ctx, next) => {

        const memoryHistory = createHistory(ctx.url);//生成history
        const store = routerCreateStore(memoryHistory);
        const history = syncHistoryWithStore(memoryHistory, store);

        const { error, redirectLocation, renderProps } = await match({ history, routes: routerRoutes(store), location: ctx.url});

        await loadOnServer({ ...renderProps, store });

        const component = (
            <Provider store={store} key="provider">
                <ReduxAsyncConnect {...renderProps} />
            </Provider>
        );

        // console.log(ReactDOM.renderToString(component));

        ctx.body = '<!doctype html>\n' +
        ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>);
    });


    router.get('/example' , async (ctx, next) => {
        const memoryHistory = createHistory(ctx.url);//生成history
        const store = routerCreateStore(memoryHistory);
        const history = syncHistoryWithStore(memoryHistory, store);

        const { error, redirectLocation, renderProps } = await match({ history, routes: routerRoutes(store), location: ctx.url});

        await loadOnServer({ ...renderProps, store });

        const component = (
            <Provider store={store} key="provider">
                <ReduxAsyncConnect {...renderProps} />
            </Provider>
        );

        // console.log(ReactDOM.renderToString(component));

        ctx.body = '<!doctype html>\n' +
        ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>);
    })


    app.use(router.routes());
}


