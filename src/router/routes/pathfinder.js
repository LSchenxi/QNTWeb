const Layout = () => import('@/layout/index.vue')

export default {
  name: 'pathfinder',
  path: '/pathfinder',
  component: Layout,
  redirect: '/pathfinder',
  children: [
    {
      name: 'Pathfinder',
      path: 'pathfinder',
      component: () => import('@/views/pathfinder/pathfinder.vue'),
      meta: {
        title: '探路机',
        icon: 'baseline-menu',
        order: 1
      }
    }
  ]
}
