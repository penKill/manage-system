import {defineStore} from 'pinia';

// 上次登录地点和时间实体类
interface LastLoginInfo {
    // 上次登录时间
    lastLoginTime: string;
    //上次登录地点
    lastLoginPlace: string;
}

// 代办事项实体类
interface TodoListInfo {
    title: string;
    status: boolean;
}

const defaultDashBordLastLoginInfo = <LastLoginInfo>{
    lastLoginTime: '2023-09-02',
    lastLoginPlace: 'sz'
}
export const dashBordLastLoginInfo = defineStore('DashBordLastLoginInfo', {
    state: () => {
        return {
            item: {...defaultDashBordLastLoginInfo}
        };
    },
    getters: {
        lastLoginTime: state => {
            return state.item.lastLoginTime;
        },
        lastLoginPlace: state => {
            return state.item.lastLoginPlace;
        }
    },

    actions: {
        setLastLoginInfo(loginInfo: LastLoginInfo) {
            this.item = loginInfo
        }

    }
});

const defaultDashBordTodoListInfo = <TodoListInfo[]>[{
    title: 'title1',
    status: false
}, {
    title: 'title2',
    status: true
}]
export const dashBordTodoListInfo = defineStore('DashBordTodoListInfo', {
    state: () => {
        return {
            list: <TodoListInfo[]>[],
        }
    },
    getters: {
        dataList: state => {
            return state.list;
        },
    },

    actions: {
        setDataList(todoList: TodoListInfo[]) {
            this.list = todoList
        },
    }
});
