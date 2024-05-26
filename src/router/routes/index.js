import basic from './basic.js'
import dashboard from '@/router/routes/dashboard.js'
import dataOverview from '@/router/routes/dataOverview.js'
import userManagement from '@/router/routes/userManagement.js'
import serverControl from '@/router/routes/serverControl.js'
import realOffer from '@/router/routes/realOffer.js'
import strategy from '@/router/routes/strategy.js'
import exchange from '@/router/routes/exchange.js'
import pathfinder from '@/router/routes/pathfinder.js'

export const basicRoutes = [
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    isHidden: true
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/login.vue'),
    isHidden: true
  },
  {
    name: 'Register',
    path: '/register',
    component: () => import('@/views/register/register.vue'),
    isHidden: true
  },
]

const asyncRoutes = []
//asyncRoutes.push(basic)
asyncRoutes.push(dashboard)
asyncRoutes.push(dataOverview)
asyncRoutes.push(realOffer)
asyncRoutes.push(pathfinder)
asyncRoutes.push(strategy)
asyncRoutes.push(serverControl)
asyncRoutes.push(exchange)
asyncRoutes.push(userManagement)

//console.log(asyncRoutes)

export { asyncRoutes }
