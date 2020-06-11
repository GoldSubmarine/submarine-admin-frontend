import Layout from '@/layout'

const systemWorkflowRouter = {
  path: '/workflow',
  component: Layout,
  redirect: '/workflow/model',
  name: 'Workflow',
  meta: {
    title: '工作流程',
    icon: 'activiti',
    permission: ['workflow']
  },
  children: [
    {
      path: 'model',
      component: () => import('@/views/system/workflow/model/index'),
      name: 'WorkflowModel',
      meta: { title: '模型管理', icon: 'activiti', permission: ['actModel'] }
    },
    {
      path: 'process',
      component: () => import('@/views/system/workflow/process/index'),
      name: 'WorkflowProcess',
      meta: { title: '流程管理', icon: 'activiti', permission: ['actProcess'] }
    }
  ]
}
export default systemWorkflowRouter
