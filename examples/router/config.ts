// @ts-nocheck
import TabsView from '@/layouts/TabsView'
import BlankView from '@/layouts/BlankView'
// import PageView from '@/layouts/PageView'
/**
 * 本地静态路由配置
 * 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 * 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *
 *
 * meta : {
    icon: ''                     菜单图标，图标使用 ant-design-vue 图标库，对应 Icon 组件 的 type 属性
    invisible: false             是否隐藏此菜单项，默认false（不隐藏）；如需隐藏设置为 true（隐藏）
    page: {                      路由标签(面包屑)页相关配置
      title                      tab标签页（面包屑）名称，默认无需配置，与路由name保持一致
      closable: false            tab标签页是否能被关闭，默认为true(可关闭)，可配置为false（不可被关闭）
      cacheAble: true            tab标签页是否需要缓存，默认全部缓存
    }
  }
 */
export default {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login/Login.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'exp404',
      component: () => import('@/pages/exception/404')
    },
    {
      path: '/403',
      name: 'exp403',
      component: () => import('@/pages/exception/403')
    },
    {
      path: '/500',
      name: 'exp500',
      component: () => import('@/pages/exception/500')
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/dashboard/workplace',
      children: [
        {
          path: 'dashboard',
          redirect: '/dashboard/workplace',
          name: '仪表盘',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
              path: 'workplace',
              name: '工作台',
              meta: {
                page: {
                  closable: false
                }
              },
              component: () => import('@/pages/dashboard/workplace')
            }
          ]
        },
        {
          path: 'department',
          name: '部门列表',
          meta: {
            icon: 'apartment'
          },
          component: () => import('@/pages/department/DepartmentList.vue')
        },

        {
          path: 'test',
          name: '测试新组件',
          meta: {
            icon: 'apartment'
          },
          component: () => import('@/pages/test/index.vue')
        },
        {
          path: 'staff',
          name: '岗位列表',
          meta: {
            icon: 'robot'
          },
          component: () => import('@/pages/staff/StaffList.vue')
        },
        {
          path: 'personnel',
          name: '员工列表',
          meta: {
            icon: 'team'
          },
          component: () => import('@/pages/personnel/PersonnelList.vue')
        },
        {
          path: 'tableDrag',
          name: '表格拖拽测试',
          meta: {
            icon: 'team'
          },
          component: () => import('@/pages/tableDrag/tableDrag.vue')
        },
        {
          path: 'organizationRelation',
          name: '组织关系',
          meta: {
            invisible: true
          },
          component: () => import('@/pages/personnel/components/RelationList.vue')
        },
        {
          path: 'user-list',
          name: '用户列表',
          meta: {
            icon: 'user'
          },
          component: () => import('@/pages/user/UserList.vue')
        },
        {
          path: 'roleList',
          name: '用户的角色列表',
          meta: {
            invisible: true
          },
          component: () => import('@/pages/user/components/RoleList.vue')
        },
        // {
        //   path: 'insertUser',
        //   name: '新增用户',
        //   meta: {
        //     invisible: true
        //   },
        //   component: () => import('@/pages/user/components/InsertUser.vue')
        // },
        {
          path: 'userRelation',
          name: '账号与员工关系',
          meta: {
            invisible: true
          },
          component: () => import('@/pages/personnel/components/UserRelationList.vue')
        },
        {
          path: 'role',
          name: '角色列表',
          meta: {
            icon: 'meh'
          },
          component: () => import('@/pages/role/RoleList.vue')
        },
        {
          path: 'functionOption',
          name: '功能权限',
          meta: {
            invisible: true
          },
          component: () => import('@/pages/role/components/RoleFunctionOption.vue')
        },
        {
          path: 'dataOption',
          name: '数据权限',
          meta: {
            invisible: true
          },
          component: () => import('@/pages/role/components/RoleDataOption.vue')
        },
        {
          path: 'menuList',
          name: '菜单列表',
          meta: {
            icon: 'menu'
          },
          component: () => import('@/pages/menu/MenuList.vue')
        },

        // {
        //   path: 'resourceList',
        //   name: '资源列表',
        //   meta: {
        //     icon: 'snippets'
        //   },
        //   component: () => import('@/pages/resource/ResourceList.vue')
        // },
        {
          path: 'dataObject',
          name: '数据对象',
          meta: {
            icon: 'database'
          },
          component: () => import('@/pages/dataObject/DataObjectList.vue')
        },
        {
          path: 'insertDataObject',
          name: '新增数据对象',
          meta: {
            invisible: true

          },
          component: () => import('@/pages/dataObject/components/InsertDataObject.vue')
        },
        {
          path: 'modifyDataObject',
          name: '修改数据对象',
          meta: {
            invisible: true

          },
          component: () => import('@/pages/dataObject/components/ModifyDataObject.vue')
        },
        {
          path: 'sub-list',
          name: '系统列表',
          meta: {
            icon: 'project'
          },
          component: () => import('@/pages/subList')
        },
        {
          path: 'bpmn',
          name: '流程图',
          meta: {
            icon: 'project'
          },
          component: () => import('@/pages/bpmn/bpmn.vue')
        },
        {
          path: 'virtual-table',
          name: '表格虚拟列表',
          meta: {
            icon: 'project'
          },
          component: () => import('@/pages/virtual/virtualTable.vue')
        },
        {
          path: 'view-purchase-order',
          name: '视图组件-采购单测试',
          meta: {
            icon: 'project'
          },
          component: () => import('@/pages/viewPurchaseOrder/viewPurchaseOrder.vue')
        },
        {
          path: 'view-review',
          name: '视图预览',
          meta: {
            icon: 'project'
          },
          component: () => import('@/pages/review/reviewPage.vue')
        },
        {
          path: 'view-table',
          name: '视图表格',
          meta: {
            icon: 'project'
          },
          component: () => import('@/pages/viewTable/viewTable.vue')
        },
        {
          path: 'tableColumn',
          name: '表格列',
          meta: {
            icon: 'project'
          },
          component: () => import('@/pages/tableColumn/tableColumnList.vue')
        }
        // {
        //   path: 'operationLog',
        //   name: '操作日志',
        //   meta: {
        //     icon: 'snippets'
        //   },
        //   component: () => import('@/pages/log/LogList.vue')
        // }

      ]
    }

  ]
}
