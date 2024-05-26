const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Basic',
  path: '/base',
  component: Layout,
  redirect: '/base/naive',
  meta: {
    title: '基础功能',
    icon: 'baseline-menu',
    order: 1
  },
  children: [
    {
      name: 'BaseNaive',
      path: 'naive',
      component: () => import('@/views/basic/naive/index.vue'),
      meta: {
        title: '基础组件',
        icon: 'baseline-menu'
      }
    },
    {
      name: 'BaseTable',
      path: 'table',
      component: () => import('@/views/basic/table/index.vue'),
      meta: {
        title: '基础表格',
        icon: 'baseline-menu'
      }
    },
    {
      name: 'BaseUpload',
      path: 'upload',
      component: () => import('@/views/basic/upload/index.vue'),
      meta: {
        title: '基础上传',
        icon: 'baseline-menu'
      }
    }
  ]
}
