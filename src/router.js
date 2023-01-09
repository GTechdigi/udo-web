import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * routes
 */
export const routes = [
  {
    path: '',
    redirect: '/dashboard'
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/login/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/login/404'),
    hidden: true,
    meta: {
      title: '404 Error'
    }
  },

  // DASHBOARD
  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: {
          title: '首页',
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  },

  // DATA SOURCE
  {
    path: '/datasource',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/datasource/index'),
        name: 'datasource',
        meta: {
          title: '数据源管理',
          icon: 'shujulianjie'
        }
      },
      {
        path: 'table',
        component: () => import('@/views/datasource/table'),
        hidden: true,
        meta: {
          title: '数据库表'
        }
      },
      {
        path: 'column',
        component: () => import('@/views/datasource/column'),
        hidden: true,
        meta: {
          title: '数据库列'
        }
      }
    ]
  },

  // PROJECT
  {
    path: '/project',
    component: Layout,
    redirect: '/project/list',
    alwaysShow: true, // will always show the root menu
    name: 'ProjectMgmt',
    meta: {
      title: '项目管理',
      icon: 'el-icon-set-up'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/project/index'),
        name: 'ProjectList',
        meta: {
          title: '项目列表'
        }
      },
      {
        path: 'add',
        component: () => import('@/views/project/addproject'),
        name: 'ProjectEditor',
        meta: {
          title: '添加项目'
        },
        hidden: true
      }
    ]
  },

  // RULE
  {
    path: '/rule',
    component: Layout,
    redirect: '/rule/list',
    alwaysShow: true,
    name: 'DataMonitor',
    meta: {
      title: '数据监控',
      icon: 'lock'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/rule/list'),
        name: 'RuleList',
        meta: {
          title: '数据监控列表'
        }
      },
      {
        path: 'add',
        component: () => import('@/views/rule/add'),
        name: 'RuleEditor',
        meta: {
          title: '添加数据监控'
        },
        hidden: true
      }
    ]
  },

  // JOB
  {
    path: '/job',
    redirect: '/job/list',
    component: Layout,
    alwaysShow: true,
    name: 'Job',
    meta: {
      title: '调度任务',
      icon: 'el-icon-set-up'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/job/index'),
        name: 'JobList',
        meta: {
          title: '调度任务列表'
        }
      },
      {
        path: 'add',
        component: () => import('@/views/job/addjob'),
        name: 'JobEditor',
        meta: {
          title: '添加调度任务'
        },
        hidden: true
      }
    ]
  },

  // LOGs
  {
    path: '/logs',
    redirect: '/logs/list',
    component: Layout,
    alwaysShow: true,
    name: 'Logs',
    meta: {
      title: '日志管理',
      icon: 'el-icon-chat-line-square'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/logs/list'),
        name: 'LogList',
        meta: {
          title: '数据日志'
        }
      }
    ]
  },

  // USER
  {
    path: '/user',
    redirect: '/user/list',
    component: Layout,
    alwaysShow: true,
    name: 'Users',
    meta: {
      title: '用户管理',
      icon: 'el-icon-set-up'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/user/index'),
        name: 'UserList',
        meta: {
          title: '用户列表'
        }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
