import Layout from '@/layout'

const systemWorkflowRouter = {
  path: '/workflow/act',
  component: Layout,
  redirect: '/workflow/act/model',
  name: 'Workflow',
  meta: {
    title: '工作流程',
    icon: 'activiti',
    permission: ['systemTool']
  },
  children: [
    {
      path: 'model',
      component: () => import('@/views/system/workflow/model/index'),
      name: 'WorkflowModel',
      meta: { title: '模型管理', icon: 'activiti', permission: ['location'] }
    }
  ]
}
export default systemWorkflowRouter
