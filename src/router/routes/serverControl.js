const Layout = () => import('@/layout/index.vue')

export default {
  name: 'serverControl',
  path: '/serverControl',
  component: Layout,
  redirect: '/serverControl',
  children: [
    {
      name: 'ServerControl',
      path: 'serverControl',
      component: () => import('@/views/serverControl/serverControl.vue'),
      meta: {
        title: '服务器',
        icon: 'baseline-menu',
        order: 1
      }
    }
  ]
}
