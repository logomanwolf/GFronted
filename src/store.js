import { createStore, applyMiddleware } from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension';
import reducer from './reducers'
import {createLogger} from 'redux-logger'
const loggerMiddleware = createLogger({
    // 这里对答应日志折叠起来。详情API ：配置参考
    collapsed: true,
});
const store = createStore(reducer, composeWithDevTools(
    // other store enhancers if any
    applyMiddleware(
        loggerMiddleware,
    ),
  ));
export default store