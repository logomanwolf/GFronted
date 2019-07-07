import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// 1、引入Provider
// import { Provider } from 'react-redux'
// import store from './store'


ReactDOM.render(
    // 2、根组件使用Provider 标签包裹。那么我们下层组件可以通过react context 属性获取到传递的store 对象
    // <Provider store={store}>
        <App />
    // </Provider>
    ,
    document.getElementById('root'),
);
                        