import Cookies from 'js-cookie'
import axios from 'axios'
import { getEnv } from '@/utils'

const baseTitle = '管理平台'

export function setupRouterGuard(router) {
  createPageTitleGuard(router)
  createPageLoadingGuard(router)
  createUserCheckGuard(router)
}

export function createPageTitleGuard(router) {
  router.afterEach((to) => {
    const pageTitle = to.meta['title']
    if (pageTitle) {
      document.title = `${pageTitle} | ${baseTitle}`
    } else {
      document.title = baseTitle
    }
  })
}

export function createPageLoadingGuard(router) {
  router.beforeEach(() => {
    window.$loadingBar?.start()
  })

  router.afterEach(() => {
    setTimeout(() => {
      window.$loadingBar?.finish()
    }, 200)
  })

  router.onError(() => {
    window.$loadingBar?.error()
  })
}

const { VITE_API_BASE_URL } = getEnv()
const whiteList = ['/login', '/404', '/register'] // 不重定向白名单
async function checkLogin() {
  let loginStatus = false
  const authorizationToken = Cookies.get('WST-DMS')
  const url = VITE_API_BASE_URL + '/auth/check'
  const headers = { 'WST-DMS': authorizationToken }
  await axios.get(url, { 'headers': headers }).then(response => {
    const result = response.data
    loginStatus = result.code === 200
    if (!loginStatus) {
      $message.error("登录失效，请重新登录")
    }
  }).catch(function(error) {
    $message.error("登录失效，请重新登录")
    loginStatus = false
  })
  return loginStatus
}

export function createUserCheckGuard(router) {
  router.beforeEach((to, from, next) => {
    if (to.meta.title) {
      document.title = to.meta.title
    }
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      checkLogin().then(function(isLogin) {
        if (isLogin) {
          if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({ path: '/' })
          } else {
            // 获取当前登录信息
            next()
          }
        } else {
          if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
          } else {
            // other pages that do not have permission to access are redirected to the login page.
            next('/login')
          }
        }
      }).catch((error) => {
        $message.error("登录失效，请重新登录")
        next(`/login`)
      })
    }
  })
}
