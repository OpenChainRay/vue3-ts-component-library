// @ts-nocheck
/**
 * 该插件可根据菜单配置自动生成 ANTD menu组件
 * menuOptions示例：
 * [
 *  {
 *    name: '菜单名称',
 *    path: '菜单路由',
 *    meta: {
 *      icon: '菜单图标',
 *      invisible: 'boolean, 是否不可见, 默认 false',
 *    },
 *    children: [子菜单配置]
 *  },
 *  {
 *    name: '菜单名称',
 *    path: '菜单路由',
 *    meta: {
 *      icon: '菜单图标',
 *      invisible: 'boolean, 是否不可见, 默认 false',
 *    },
 *    children: [子菜单配置]
 *  }
 * ]
 *
 * i18n: 国际化配置。系统默认会根据 options route配置的 path 和 name 生成英文以及中文的国际化配置，如需自定义或增加其他语言，配置
 * 此项即可。如：
 * i18n: {
 *   messages: {
 *     CN: {dashboard: {name: '监控中心'}}
 *     HK: {dashboard: {name: '監控中心'}}
 *   }
 * }
 **/

import Menu from 'ant-design-vue/es/menu'
import Icon from 'ant-design-vue/es/icon'
import fastEqual from 'fast-deep-equal'
import { getI18nKey } from '@/utils/routerUtil'

const { Item, SubMenu } = Menu

const compactChildren = (children) => {
  const queue = Array.isArray(children) ? children : [children]
  const result = []
  queue.forEach((item) => {
    if (Array.isArray(item)) {
      item.forEach((child) => {
        if (child !== null && child !== undefined && child !== false) {
          result.push(child)
        }
      })
      return
    }
    if (item !== null && item !== undefined && item !== false) {
      result.push(item)
    }
  })
  return result
}

/**
 * 格式化路由路径
 *
 * @param {string} 原路由路径，例：/router/dynamic/:id
 * @param {object} 参数对象，例：{id: 123}
 * @return {string} 格式化以后的路径，例： /router/dynamic/123
 */
const resolvePath = (path, params = {}) => {
  let _path = path
  Object.entries(params).forEach(([key, value]) => {
    _path = _path.replace(new RegExp(`:${key}`, 'g'), value)
  }
  })
  return _path
}

/**
 * 格式化路由配置（数组）成对象(键key值value对)，数组中元素对象的属性path作为{string}key，其余属性作为{object}value
 *
 * @param { array } 路由配置
 * @return { object } 路由map
 */
const toRoutesMap = (routes) => {
  const map = {}
  routes.forEach(route => {
    map[route.fullPath] = route
    if (route.children && route.children.length > 0) {
      const childrenMap = toRoutesMap(route.children)
      Object.assign(map, childrenMap)
    }
  })
  return map
}

export default {
  name: 'IMenu',
  props: {
    options: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    // 是否收起
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    i18n: Object,
    openKeys: Array
  },
  data () {
    return {
      selectedKeys: [],
      // a-sub-menu 当前展开菜单项 key
      sOpenKeys: [],
      // 缓存当前展开菜单项 key，变更a-layout-sider当前收起状态（collapsible）时,变更a-sub-menu时会丢失openKeys值
      cachedOpenKeys: []
    }
  },
  computed: {
    menuTheme () {
      return this.theme == 'light' ? this.theme : 'dark'
    },
    routesMap () {
      return toRoutesMap(this.options)
    }
  },
  created () {
    this.updateMenu()
    // 如果路由对象不为空，并且没有fullPath值
    if (this.options.length > 0 && !this.options[0].fullPath) {
      this.formatOptions(this.options, '')
    }
    // 自定义国际化配置
    if (this.i18n && this.i18n.messages) {
      const messages = this.i18n.messages
      Object.keys(messages).forEach(key => {
        this.$i18n.mergeLocaleMessage(key, messages[key])
    }
  })
    }
  },
  watch: {
    options (val) {
      if (val.length > 0 && !val[0].fullPath) {
        this.formatOptions(this.options, '')
      }
    },
    i18n (val) {
      if (val && val.messages) {
        const messages = this.i18n.messages
        Object.keys(messages).forEach(key => {
          this.$i18n.mergeLocaleMessage(key, messages[key])
     }
   })
      }
    },
    collapsed (val) {
      if (val) {
        this.cachedOpenKeys = this.sOpenKeys
        this.sOpenKeys = []
      } else {
        this.sOpenKeys = this.cachedOpenKeys
      }
    },
    $route: function () {
      this.updateMenu()
    },
    sOpenKeys (val) {
      this.$emit('openChange', val)
      this.$emit('update:openKeys', val)
    }
  },
  methods: {
    // 获取a-menu当前选中项（从父到子）的path
    getSelectedKeys () {
      // $route.matched为一个路由匹配到(打开)的所有（包含父级路由信息）路由记录
      let matches = this.$route.matched
      // 最后一条记录为当前打开的路由对象
      const route = matches[matches.length - 1]
      // 从通过toRoutesMap格式化过的路由集合中取出当前选中页的路由信息
      let chose = this.routesMap[route.path]
      // 如果配置meta下的highlight属性则通过$router.resolve打开为标签页
      if (chose && chose.meta && chose.meta.highlight) {
        chose = this.routesMap[chose.meta.highlight]
        const resolve = this.$router.resolve({ path: chose.fullPath })
        matches = (resolve.resolved && resolve.resolved.matched) || matches
      }
      return matches.map(item => item.path)
    },
    // 初始化当前展开的 a-sub-menu 菜单项 openKeys(页面路由path，例：dashboard)
    updateMenu () {
      this.selectedKeys = this.getSelectedKeys()
      let openKeys = this.selectedKeys.filter(item => item !== '')
      // 当前打开页的父级path
      openKeys = openKeys.slice(0, openKeys.length - 1)
      // 深比较，是否开启了新页面
      if (!fastEqual(openKeys, this.sOpenKeys)) {
        this.collapsed || this.mode === 'horizontal' ? this.cachedOpenKeys = openKeys : this.sOpenKeys = openKeys
      }
    },
    // 给路由对象添加fullPath属性值，将path格式化成fullpath('dashboard' -> '/dashboard')
    formatOptions (options, parentPath) {
      options.forEach(route => {
        const isFullPath = route.path.substring(0, 1) == '/'
        route.fullPath = isFullPath ? route.path : parentPath + '/' + route.path
        if (route.children) {
          this.formatOptions(route.children, route.fullPath)
        }
      })
    },
    // 渲染mune项左侧图标
    renderIcon: function (h, icon, key) {
      if (this.$scopedSlots.icon && icon && icon !== 'none') {
        const vnodes = compactChildren(this.$scopedSlots.icon({ icon, key }))
        vnodes.forEach(vnode => {
          if (!vnode || !vnode.data) {
            return
          }
          vnode.data.class = vnode.data.class ? vnode.data.class : []
          vnode.data.class.push('anticon')
     }
   })
        return vnodes
      }
      return !icon || icon == 'none' ? null : h(Icon, { props: { type: icon } })
    },
    // 渲染无子路由集合为a-menu-item组件
    renderMenuItem: function (h, menu) {
      if (!menu) {
        return null
      }
      let tag = 'router-link'
      const path = resolvePath(menu.fullPath, menu.meta.params)
      // 配置router-link标签属性
      let config = { props: { to: { path, query: menu.meta.query } }, attrs: { style: 'overflow:hidden;white-space:normal;text-overflow:clip;' } }
      // menu入口如果配置了远程路径，则打开远程页面
      if (menu.meta && menu.meta.link) {
        tag = 'a'
        config = { attrs: { style: 'overflow:hidden;white-space:normal;text-overflow:clip;', href: menu.meta.link, target: '_blank' } }
      }
      const menuItemChildren = compactChildren([
        this.renderIcon(h, menu.meta ? menu.meta.icon : 'none', menu.fullPath),
        this.$t(getI18nKey(menu.fullPath))
      ])
      return h(
        Item, { key: menu.fullPath },
        [
          h(tag, config,
            menuItemChildren
          )
        ]
      )
    },
    // 渲染包含子路由的集合成，分别处理父级和子级路由,父级渲染成a-sub-item组件,子集渲染成a-menu-item组件
    renderSubMenu: function (h, menu) {
      if (!menu) {
        return null
      }
      const this_ = this
      const subItem = [h('span', { slot: 'title', attrs: { style: 'overflow:hidden;white-space:normal;text-overflow:clip;' } },
        compactChildren([
          this.renderIcon(h, menu.meta ? menu.meta.icon : 'none', menu.fullPath),
          this.$t(getI18nKey(menu.fullPath))
        ])
      )]
      const itemArr = []
      menu.children.forEach(function (item) {
        const childNode = this_.renderItem(h, item)
        if (childNode) {
          itemArr.push(childNode)
        }
      })
      return h(SubMenu, { key: menu.fullPath },
        subItem.concat(itemArr)
      )
    },
    // 解析路由对象，分别处理包含子集和不包含子集的路由集合
    renderItem: function (h, menu) {
      if (!menu) {
        return null
      }
      const meta = menu.meta
      // 如果没有meta配置或者有meta配置但是invisible没有配置或者为false（不隐藏）
      if (!meta || !meta.invisible) {
        let renderChildren = false
        const children = menu.children
        // 是否有子路由
        if (children != undefined) {
          for (let i = 0; i < children.length; i++) {
            const childMeta = children[i].meta
            if (!childMeta || !childMeta.invisible) {
              renderChildren = true
              break
            }
          }
        }
        // 如果没有子路由调用renderMenuItem，如果有则调用renderSubMenu
        return (menu.children && renderChildren) ? this.renderSubMenu(h, menu) : this.renderMenuItem(h, menu)
      }
      return null
    },
    // 渲染a-menu-item
    renderMenu: function (h, menuTree) {
      const this_ = this
      const menuArr = []
      menuTree.forEach(function (menu, i) {
        const menuNode = this_.renderItem(h, menu, '0', i)
        if (menuNode) {
          menuArr.push(menuNode)
        }
      })
      return menuArr
    }
  },
  render (h) {
    return h(
      // 标签名、组件对象
      Menu,
      // 与模板中 attribute 对应的数据对象
      {
        props: {
          // a-menu组件相关参数，具体见https://antdv.com/components/menu-cn/#API
          // 主题颜色
          theme: this.menuTheme,
          // 菜单类型，现在支持垂直、水平、和内嵌模式三种
          mode: this.$props.mode,
          // 当前选中的菜单项 key 数组
          selectedKeys: this.selectedKeys,
          // 当前展开的 SubMenu 菜单项 key 数组
          openKeys: this.openKeys ? this.openKeys : this.sOpenKeys
        },
        on: {
          'update:openKeys': (val) => {
            this.sOpenKeys = val
          },
          click: (obj) => {
            obj.selectedKeys = [obj.key]
            this.$emit('select', obj)
          }
        }
      }, this.renderMenu(h, this.options)
    )
  }
}
