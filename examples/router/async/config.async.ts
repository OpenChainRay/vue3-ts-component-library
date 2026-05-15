// @ts-nocheck
import routerMap from './router.map'
import { parseRoutes } from '@/utils/routerUtil'
// 异步路由配置
const routesConfig = [
  {
    router: 'root',
    children: [
      {
        router: 'dashboard',
        children: ['workplace']
      }
    ]
  },
  {
    router: 'login',
    path: '/login',
    name: '登陆'
  },
  {
    router: 'exp404',
    path: '/:pathMatch(.*)*',
    name: 'exp404'
  },
  {
    router: 'exp403',
    path: '/403',
    name: 'exp403'
  },
  {
    router: 'exp500',
    path: '/500',
    name: 'exp500'
  }
]

const options = {
  routes: parseRoutes(routesConfig, routerMap)

}

export default options
