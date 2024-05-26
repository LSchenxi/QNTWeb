const Layout = () => import('@/layout/index.vue')

export default {
  name: 'exchange',
  path: '/exchange',
  component: Layout,
  redirect: '/exchange',
  children: [
    {
      name: 'Exchange',
      path: 'exchange',
      component: () => import('@/views/exchange/exchange.vue'),
      meta: {
        title: '交易所',
        icon: 'baseline-menu',
        order: 1
      }
    }
  ]
}
