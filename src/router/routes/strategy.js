const Layout = () => import('@/layout/index.vue')

export default {
  name: 'strategy',
  path: '/strategy',
  component: Layout,
  redirect: '/realOffer',
  children: [
    {
      name: 'Strategy',
      path: 'strategy',
      component: () => import('@/views/strategy/strategy.vue'),
      meta: {
        title: '策略库',
        icon: 'baseline-menu',
        order: 1
      }
    }
  ]
}
