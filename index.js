import Koa from 'koa';
import koaStatic from 'koa-static';
import convert from 'koa-convert';
import path from 'path';
import webpack from 'webpack';
import webpackHotMiddleware from 'koa-webpack-hot-middleware';
import webpackDevMiddleware from 'koa-webpack-dev-middleware';
import webpackConfig from './webpack.config.babel'
import co from 'co';
import router from './routes';

const app = new Koa();

app.use((ctx, next) => {
    const start = new Date();
    return next().then(() => {
        const ms = new Date() - start;
        console.log(`koa ${ctx.method} ${ctx.url} - ${ms}ms`);
    })
})

app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`async ${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(co.wrap(function *(ctx, next) {
    const start = new Date();
    yield next();
    const ms = new Date() - start;
    console.log(`generator ${ctx.method} ${ctx.url} - ${ms}ms`);
}));

//404中间件
app.use(async (ctx, next) => {
    await next();
    if (404 != ctx.status) {
        return;
    };

    ctx.status = 404;

    switch(ctx.accepts('html', 'json')) {
        case 'html':
            ctx.type = 'html';
            ctx.body = '<p>Page Not Found</p>';
            break;
        case 'json':
            ctx.body = {
                message: 'Page Not Found'
            };
            break;
        default:
            ctx.type = 'text';
            ctx.body = 'Page Not Found';
    }
});

//error处理
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.type = 'html';
        ctx.body = '<p>Something <em>exploded</em>, please contact Maru.</p>'
        ctx.app.emit('error', err, ctx)
    }
});
app.on('error', (err) => {
    if (process.env.NODE_ENV != 'test') {
        console.log('sent error %s to the cloud', err.message);
        console.log(err);
    };
})


const opts = {
    maxage: 1000 * 60 * 60 * 24 * 365, // 1年，默认为0
    hidden: false, // 能否返回隐藏文件（以`.`打头），默认false不返回
    index: 'index.js', // 默认文件名
    defer: true, // 在yield* next之后返回静态文件，默认在之前
    gzip: true 
    // 允许传输gzip，如静态文件夹下有两个文件，index.js和index.js.gz，
    // 会优先传输index.js.gz，默认开启
};

const compiler = webpack(webpackConfig);

app.use(convert(koaStatic(path.join(__dirname + 'public'), opts)));

app.use(convert(webpackDevMiddleware(
    compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath })
));
app.use(convert(webpackHotMiddleware(compiler)));


router(app);


// app.use(async (ctx) => {
//     ctx.body = 'Hello Koa';
// });

const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.info('==> ✅  Server is listening on %s ===', port)
});