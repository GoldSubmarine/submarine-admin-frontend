import Layout from '@/layout'

const systemToolRouter = {
  path: '/system/tool',
  component: Layout,
  redirect: '/system/tool/file-store',
  name: 'SystemTool',
  meta: {
    title: '系统工具',
    icon: 'systemTool',
    permission: ['systemTool']
  },
  children: [
    {
      path: 'file-store',
      component: () => import('@/views/system/tool/fileStore/index'),
      name: 'FileStore',
      meta: { title: '存储管理', icon: 'fileStore', permission: ['fileStore'] }
    },
    {
      path: 'quartz-job',
      component: () => import('@/views/system/tool/quartzJob/index'),
      name: 'quartzJob',
      meta: { title: '定时任务', icon: 'schedule', permission: ['quartzJob'] }
    },
    {
      path: 'monitor-sql',
      component: () => import('@/views/system/tool/monitorSql/index'),
      name: 'monitorSql',
      meta: { title: 'SQL监控', icon: 'monitorSql', permission: ['fileStore'] }
    },
    // {
    //   path: 'redis',
    //   component: () => import('@/views/system/tool/redis/index'),
    //   name: 'redis',
    //   meta: { title: 'redis', icon: 'redis', permission: ['fileStore'] }
    // },
    {
      path: 'location',
      component: () => import('@/views/system/tool/location/index'),
      name: 'location',
      meta: { title: '省市区', icon: 'location', permission: ['location'] }
    }
  ]
}
export default systemToolRouter
