import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/permission',
  name: 'System',
  meta: {
    title: '系统设置',
    icon: 'system'
  },
  children: [
    {
      path: 'permission',
      component: () => import('@/views/system/permission/index'),
      name: 'Permission',
      meta: { title: '权限管理', icon: 'permission' }
    },
    {
      path: 'menu',
      component: () => import('@/views/system/menu/index'),
      name: 'menu',
      meta: { title: '菜单管理', icon: 'permission' }
    },
    {
      path: 'dept',
      component: () => import('@/views/system/dept/index'),
      name: 'dept',
      meta: { title: '部门管理', icon: 'permission' }
    },
    // {
    //   path: 'drag-table',
    //   component: () => import('@/views/table/drag-table'),
    //   name: 'DragTable',
    //   meta: { title: 'dragTable' }
    // },
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/table/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'inlineEditTable' }
    // },
    // {
    //   path: 'complex-table',
    //   component: () => import('@/views/table/complex-table'),
    //   name: 'ComplexTable',
    //   meta: { title: 'complexTable' }
    // }
  ]
}
export default systemRouter
