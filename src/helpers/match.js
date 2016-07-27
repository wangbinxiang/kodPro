import { match } from 'react-router';

export default  ({ routes, location, history }) => {
    return new Promise((resolve, reject) => {
        let params = {};
        if (history) {
            params = { routes, location, history };
        } else {
            params = { routes, location };
        }
        match(params, (error, redirectLocation, renderProps) => {
            if (error) {
                return reject(error);
            };
            resolve({ redirectLocation, renderProps });
        })
    })
}
