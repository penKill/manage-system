import {defineStore} from 'pinia';

interface LastLoginInfo {
    // 上次登录时间
    lastLoginTime: string;
    //上次登录地点
    lastLoginPlace: string;
}

const defaultValue = <LastLoginInfo>{
    lastLoginTime: '2023-09-02',
    lastLoginPlace: 'sz'
}
export const dashBordLastLoginInfo = defineStore('lastlogininfo', {
    state: () => {
        return {
            item: {...defaultValue}
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
        },
        setLastLoginTime(lastLoginTime: string) {
            this.item.lastLoginTime = lastLoginTime;
        },
        setLastLoginPlace(lastLoginPlace: string) {
            this.item.lastLoginPlace = lastLoginPlace;
        }
    }
});
