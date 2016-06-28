import WebpackIsomorphicTools from 'webpack-isomorphic-tools';
import path from 'path';
import webpackIsmorphicToolsConfig  from '../webpack-isomorphic-tools';

const project_base_path = path.resolve(__dirname, '..');

global.webpackIsomorphicTools = new WebpackIsomorphicTools(webpackIsmorphicToolsConfig)
    .development(true)
    .server(project_base_path, () => {
        require('../index');
    });