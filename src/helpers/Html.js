import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom/server';
import Helmet from 'react-helmet';



export default class Html extends Component {
    static propTypes = {
      assets: PropTypes.object,
      component: PropTypes.node,
      store: PropTypes.object
    };

    render() {
        const { assets, component, store } = this.props;
        const content = component? ReactDOM.renderToString(component): '';
        const head = Helmet.rewind();

        return(
            <html lang="en-us">
                <head>
                    {head.base.toComponent()}
                    {head.title.toComponent()}
                    {head.meta.toComponent()}
                    {head.link.toComponent()}
                    {head.script.toComponent()}


                    <meta name="viewport" content="width=device-width, initial-scale=1" />

                    {Object.keys(assets.styles).map((style, key) => {
                        return <link href={assets.styles[style]} key={key} media="screen, projection" rel="stylesheet" type="text/css" charSet="UTF-8" />
                    })}
                </head>
                <body>
                    <div id="content" dangerouslySetInnerHTML={{__html: content}} />
                    <script dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__=${JSON.stringify(store.getState())};`}} charSet="UTF-8" />
                    <script src={assets.javascript.main} charSet="UTF-8"/>
                </body>
            </html>
        );
    }
}