import { combineReducers } from 'redux'

// 用户Reducer
const updateNodes = (state = {}, action) => {
    if (action.type === "updateNodes" ) {
        return Object.assign(state, {
            'nodeMap': action.content
        });
    }
    return state;
}
const updateNodeMap=(state = {}, action) => {
    if (action.type === "updateNodeMap" ) {
        return Object.assign(state, {
            'nodeMap': action.content
        });
    }
    return state;
}
const addG=(state = {}, action) => {
    if (action.type === "addG" ) {
        return Object.assign(state, {
            'g': action.content
        });
    }
    return state;
}
// combineReducers 合并Reducer
const reducer = combineReducers({
    updateNodes,
    updateNodeMap,
    addG
});

// 在这里，我们导出reducers， 并在store.js 文件导入获取该 最终达到reducer 对象

export default reducer;