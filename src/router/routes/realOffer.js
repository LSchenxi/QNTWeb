const Layout = () => import('@/layout/index.vue')

export default {
  name: 'realOffer',
  path: '/realOffer',
  component: Layout,
  redirect: '/realOffer',
  children: [
    {
      name: 'RealOffer',
      path: 'realOffer',
      component: () => import('@/views/realOffer/realOffer.vue'),
      meta: {
        title: '实盘',
        icon: 'baseline-menu',
        order: 1
      }
    },
    {
      name: 'RealOfferDetail',
      path: 'realOfferDetail',
      component: () => import('@/views/realOffer/realOfferDetail.vue'),
      meta: {
        title: '实盘监控',
        icon: 'baseline-menu'
      },
      isHidden: true
    },
    {
      name: 'RealOfferUpdateDetail',
      path: 'realOfferUpdateDetail',
      component: () => import('@/views/realOffer/realOfferUpdateDetail.vue'),
      meta: {
        title: '实盘参数',
        icon: 'baseline-menu'
      },
      isHidden: true
    }
  ]
}
