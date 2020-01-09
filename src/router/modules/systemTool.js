import Layout from '@/layout'

const systemToolRouter = {
  path: '/system/tool',
  component: Layout,
  redirect: '/system/tool/file-store',
  name: 'SystemTool',
  meta: {
    title: '系统工具',
    icon: 'system',
    permission: ['system']
  },
  children: [
    {
      path: 'file-store',
      component: () => import('@/views/system/tool/fileStore/index'),
      name: 'FileStore',
      meta: { title: '存储管理', icon: 'permission' }
    }
  ]
}
export default systemToolRouter
