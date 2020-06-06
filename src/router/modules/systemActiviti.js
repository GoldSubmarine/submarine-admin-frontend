import Layout from '@/layout'

const systemActivitiRouter = {
  path: '/system/activiti',
  component: Layout,
  redirect: '/system/activiti/model',
  name: 'SystemTool',
  meta: {
    title: '工作流程',
    icon: 'activiti',
    permission: ['systemTool']
  },
  children: [
    {
      path: 'model',
      component: () => import('@/views/system/activiti/model/index'),
      name: 'activiti',
      meta: { title: '流程设计', icon: 'activiti', permission: ['location'] }
    }
  ]
}
export default systemActivitiRouter
