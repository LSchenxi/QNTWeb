const Layout = () => import('@/layout/index.vue')

export default {
  // name: 'dataOverview',
  // path: '/dataOverview',
  name: 'Root',
  path: '/',
  component: Layout,
  redirect: '/dataOverview',
  children: [
    {
      name: 'DataOverview',
      path: 'dataOverview',
      component: () => import('@/views/dataOverview/dataOverview.vue'),
      meta: {
        title: '数据概览',
        icon: 'baseline-menu',
        order: 0
      }
    }
  ]
}
