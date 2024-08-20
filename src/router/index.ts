import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
import {usePermissStore} from '../store/permiss';
import Home from '../views/home.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            {
                path: '/charts',
                name: 'basecharts',
                meta: {
                    title: '图表',
                    permiss: '11',
                },
                component: () => import(/* webpackChunkName: "charts" */ '../views/charts.vue'),
            },
            {
                path: '/form',
                name: 'baseform',
                meta: {
                    title: '表单',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/form.vue'),
            },
            {
                path: '/permission',
                name: 'permission',
                meta: {
                    title: '权限管理',
                    permiss: '13',
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/manager/permission.vue'),
            },
            {
                path: '/upload',
                name: 'upload',
                meta: {
                    title: '上传插件',
                    permiss: '6',
                },
                component: () => import(/* webpackChunkName: "upload" */ '../views/upload.vue'),
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心',
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/index/user.vue'),
            },
            {
                path: '/markdown',
                name: 'markdown',
                meta: {
                    title: 'markdown编辑器',
                    permiss: '9',
                },
                component: () => import(/* webpackChunkName: "markdown" */ '../views/markdown.vue'),
            },

            {
                path: '/userManage',
                name: 'userManage',
                meta: {
                    title: '用户管理',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/manager/userManage.vue'),
            },
            {
                path: '/accountManage',
                name: 'accountManage',
                meta: {
                    title: '账户管理',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/manager/accountManage.vue'),
            },
            {
                path: '/systemConfig',
                name: 'systemConfig',
                meta: {
                    title: '系统设置',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/manager/systemConfig.vue'),
            },
            {
                path: '/introduce',
                name: 'introduce',
                meta: {
                    title: '套餐详情',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/order/introduce.vue'),
            },
            {
                path: '/orderList',
                name: 'orderList',
                meta: {
                    title: '订单列表',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/order/orderList.vue'),
            },
            {
                path: '/fileManage',
                name: 'fileManage',
                meta: {
                    title: '文件管理',
                    permiss: '2',
                },
                component: () => import(/* webpackChunkName: "import" */ '../views/other/fileManage.vue'),
            }
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    //获取后端系统设置 存放到浏览器中
    let title = '';
    if (localStorage.getItem('systemInfo')) {
        title = JSON.parse(<string>localStorage.getItem('systemInfo')).pageTitle;
    }
    document.title = title
    const username = sessionStorage.getItem('ms_username');
    const permiss = usePermissStore();
    if (!username && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403 权限获取是在登录完成后讲当前用户所有的权限信息写入sessionStorage中
        next('/403');
    } else {
        next();
    }
});

export default router;
