import Layout from '@/layout'

const systemManageRouter = {
  path: '/system/manage',
  component: Layout,
  redirect: '/system/manage/permission',
  name: 'System',
  meta: {
    title: '系统设置',
    icon: 'system',
    permission: ['systemManage']
  },
  children: [
    {
      path: 'permission',
      component: () => import('@/views/system/manage/permission/index'),
      name: 'Permission',
      meta: { title: '权限管理', icon: 'permission', permission: ['permission'] }
    },
    {
      path: 'dept',
      component: () => import('@/views/system/manage/dept/index'),
      name: 'dept',
      meta: { title: '部门管理', icon: 'tree', permission: ['dept'] }
    },
    {
      path: 'role',
      component: () => import('@/views/system/manage/role/index'),
      name: 'role',
      meta: { title: '角色管理', icon: 'role', permission: ['role'] }
    },
    {
      path: 'user',
      component: () => import('@/views/system/manage/user/index'),
      name: 'user',
      meta: { title: '用户管理', icon: 'user', permission: ['user'] }
    },
    {
      path: 'dictionary',
      component: () => import('@/views/system/manage/dictionary/index'),
      name: 'dictionary',
      meta: { title: '字典管理', icon: 'dictionary', permission: ['dictionary'] }
    }
  ]
}
export default systemManageRouter
