import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: 'data'
  },
  layout: {
    title: '出货管理',
  },
  proxy: {
    '/api': {
      'target': 'http://local.test.com:16160',
      'changeOrigin': true,
      // 'pathRewrite': { '^/api' : '' },
    },
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '登陆',
      path: '/login',
      component: './Login',
      hideInMenu: true,
      menuRender: false,
    },
    {
      name: '货物列表',
      path: '/home',
      component: './Home',
    },
    {
      name: '货单编辑',
      path: '/goods-edit',
      component: './GoodsEdit',
      hideInMenu: true
    },
    {
      name: '客户名单',
      path: '/user',
      component: './User',
    },
  ],
  npmClient: 'cnpm',
});

