// @ts-nocheck
// 视图组件
const view = {
  tabs: () => import('@/layouts/TabsView'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由组件注册
export default {
  // 无需鉴权
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '/403',
    component: () => import('@/pages/exception/403')
  },
  exp404: {
    name: 'exp404',
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/exception/404')
  },
  exp500: {
    name: 'exp500',
    path: '/500',
    component: () => import('@/pages/exception/500')
  },
  login: {
    authority: '*',
    path: '/login',
    component: () => import('@/pages/login')
  },
  root: {
    path: '/',
    name: '首页',
    redirect: '/dashboard/workplace',
    component: view.tabs
  },
  dashboard: {
    name: '仪表盘',
    path: 'dashboard',
    redirect: '/dashboard/workplace',
    component: view.blank,
    meta: {
      icon: 'dashboard'
    }
  },
  workplace: {
    name: '工作台',
    path: 'workplace',
    meta: {
      page: {
        closable: false
      }
    },
    component: () => import('@/pages/dashboard/workplace')
  },
  // 需鉴权
  department: {
    name: '部门列表',
    meta: {
      icon: 'apartment'
    },
    component: () => import('@/pages/department/DepartmentList.vue')
  },
  staff: {
    name: '岗位列表',
    meta: {
      icon: 'robot'
    },
    component: () => import('@/pages/staff/StaffList.vue')
  },
  personnel: {
    name: '员工列表',
    meta: {
      icon: 'team'
    },
    component: () => import('@/pages/personnel/PersonnelList.vue')
  },
  'user-list': {
    name: '用户列表',
    meta: {
      icon: 'user'
    },
    component: () => import('@/pages/user/UserList.vue')
  },
  role: {
    name: '角色列表',
    meta: {
      icon: 'meh'
    },
    component: () => import('@/pages/role/RoleList.vue')
  },
  menuList: {
    name: '菜单列表',
    meta: {
      icon: 'menu'
    },
    component: () => import('@/pages/menu/MenuList.vue')
  },
  dataObject: {
    name: '数据对象',
    meta: {
      icon: 'database'
    },
    component: () => import('@/pages/dataObject/DataObjectList.vue')
  },
  'sub-list': {
    name: '系统列表',
    meta: {
      icon: 'project'
    },
    component: () => import('@/pages/subList')
  },
  userRelation: {
    name: '账号与员工关系',
    meta: {
      invisible: true
    },
    component: () => import('@/pages/personnel/components/UserRelationList.vue')
  },
  organizationRelation: {
    name: '组织关系',
    meta: {
      invisible: true
    },
    component: () => import('@/pages/personnel/components/RelationList.vue')
  },
  roleList: {
    name: '用户的角色列表',
    meta: {
      invisible: true
    },
    component: () => import('@/pages/user/components/RoleList.vue')
  },
  functionOption: {
    name: '功能权限',
    meta: {
      invisible: true
    },
    component: () => import('@/pages/role/components/RoleFunctionOption.vue')
  },
  dataOption: {
    name: '数据权限',
    meta: {
      invisible: true
    },
    component: () => import('@/pages/role/components/RoleDataOption.vue')
  },
  insertDataObject: {
    name: '新增数据对象',
    meta: {
      invisible: true
    },
    component: () => import('@/pages/dataObject/components/InsertDataObject.vue')
  },
  modifyDataObject: {
    name: '修改数据对象',
    meta: {
      invisible: true
    },
    component: () => import('@/pages/dataObject/components/ModifyDataObject.vue')
  },
  virtualTable: {
    name: '表格虚拟列表',
    meta: {
      invisible: true
    },
    component: () => import('@/pages/virtual/virtualTable.vue')
  },
  viewPurchaseOrder: {
    name: '视图组件-采购单测试',
    meta: {
      invisible: true
    },
    component: () => import('@/pages/viewPurchaseOrder/viewPurchaseOrder.vue')
  },
  'view-review': {
    name: '视图预览',
    meta: {
      invisible: true
    },
    component: () => import('@/pages/review/reviewPage.vue')
  },
  'view-table': {
    name: '视图表格',
    meta: {
      icon: 'project'
    },
    component: () => import('@/pages/viewTable/viewTable.vue')
  },
  tableColumn: {
    name: '表格列',
    meta: {
      icon: 'apartment',
      invisible: true
    },
    component: () => import('@/pages/tableColumn/tableColumnList.vue')
  },
}
