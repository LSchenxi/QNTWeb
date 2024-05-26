const Layout = () => import('@/layout/index.vue')

export default {
  name: 'userManagement',
  path: '/userManagement',
  component: Layout,
  redirect: '/userManagement',
  children: [
    {
      name: 'UserManagement',
      path: 'userManagement',
      component: () => import('@/views/userManagement/userManagement.vue'),
      meta: {
        title: '用户管理',
        icon: 'baseline-menu',
        order: 2,
        roles: [0]
      }
    }
  ]
}
