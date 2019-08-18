import { combineReducers } from 'redux'

// 更改数据使得，点击选择search后，canvas中相应节点颜色发生变化
const alterData = (state = {}, action) => {
    if (action.type === "alterData" ) {
        return Object.assign({},state, {
            'id': action.content
        });
    }
    return state;
}
const addCommunityDetect = (state = {}, action) => {
    if (action.type === "addCommunityDetect" ) {
        return Object.assign({},state, {
            'community': action.content
        });
    }
    return state;
}
const updateNodeMap=(state = {}, action) => {
    if (action.type === "updateNodeMap" ) {
        return Object.assign({},state, {
            'nodeMap': action.content
        });
    }
    return state;
}
const addG=(state = {}, action) => {
    if (action.type === "addG" ) {
        return Object.assign({},state, {
            'g': action.content,
            // 'stamp':action.content.stamp
        });
    }
    return state;
}
const addPageRank = (state = {}, action) => {
    if (action.type === "addPageRank" ) {
        return Object.assign({},state, {
            'pageRank': action.content
        });
    }
    return state;
}
const addColorMap = (state = {}, action) => {
    if (action.type === "addColorMap" ) {
        return Object.assign({},state, {
            'colorMap': action.content
        });
    }
    return state;
}
const updateShortestPath = (state = {}, action) => {
    if (action.type === "updateShortestPath" ) {
        return Object.assign({},state, {
            'shortestPath': action.content
        });
    }
    return state;
}
const updateListPanelContent = (state = {}, action) => {
    if (action.type === "updateListPanelContent") {
        return Object.assign({},state, {
            'listPanelContent': action.content
        });
    }
    return state;
}
//conrtolPanel->forceMap
//改变文件名
const getFile = (state = {}, action) => {
    if (action.type === "getFile") {
        return Object.assign({},state, {
            'filename': action.content
        });
    }
    return state;
}

//更改当前点击的节点
//forcePanel->canvas
const updateCurClickNode = (state = {}, action) => {
    if (action.type === "updateCurClickNode") {
        return Object.assign({},state, {
            'curClickNode': action.content
        });
    }
    return state;
}
const updateSource = (state = {}, action) => {
    if (action.type === "updateSource") {
        return Object.assign({},state, {
            'source': action.content
        });
    }
    return state;
}
const updateTarget = (state = {}, action) => {
    if (action.type === "updateTarget") {
        return Object.assign({},state, {
            'target': action.content
        });
    }
    return state;
}
const updateLayout=(state = {}, action) => {
    if (action.type === "updateLayout") {
        return Object.assign({},state, {
            'layout': action.content
        });
    }
    return state;
}
const chooseCluster=(state = {}, action) => {
    if (action.type === "chooseCluster") {
        return Object.assign({}, state, {
            //这里的有cluster array里面可能有空
            'cluster': action.content
        });
    }
    return state;
}

// combineReducers 合并Reducer
const reducer = combineReducers({
    alterData,
    updateNodeMap,
    addG,
    addPageRank,
    addCommunityDetect,
    addColorMap,
    updateShortestPath,
    updateListPanelContent,
    getFile,
    updateCurClickNode,
    updateSource,
    updateTarget,
    updateLayout,
    chooseCluster
});


// 在这里，我们导出reducers， 并在store.js 文件导入获取该 最终达到reducer 对象

export default reducer;