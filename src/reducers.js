import { combineReducers } from 'redux'
import {user,hotel,} from './action'

// 用户Reducer
const toUser = (state = {}, action) => {
    if (action.type === user.userId) {
        return Object.assign(state, {
            'userID': action.text
        });
    }
    return state;
}

// 酒店Reducer
const toHotel = (state = {}, action) => {
    if (action.type === hotel.roomId) {
        return Object.assign(state, {
            'roomId': action.text
        });
    }
    return state;
}

// combineReducers 合并Reducer
const reducer = combineReducers({
    toUser,
    toHotel,
});

// 在这里，我们导出reducers， 并在store.js 文件导入获取该 最终达到reducer 对象

export default reducer;