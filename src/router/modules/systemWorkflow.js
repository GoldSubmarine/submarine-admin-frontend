import Layout from '@/layout'

const systemWorkflowRouter = {
  path: '/workflow',
  component: Layout,
  redirect: '/workflow/model',
  name: 'Workflow',
  meta: {
    title: '工作流程',
    icon: 'workflow',
    permission: ['workflow']
  },
  children: [
    {
      path: 'model',
      component: () => import('@/views/system/workflow/model/index'),
      name: 'WorkflowModel',
      meta: { title: '模型管理', icon: 'workflowModel', permission: ['workflowModel'] }
    },
    {
      path: 'process',
      component: () => import('@/views/system/workflow/process/index'),
      name: 'WorkflowProcess',
      meta: { title: '流程管理', icon: 'workflowProcess', permission: ['workflowProcess'] }
    },
    {
      path: 'launch',
      component: () => import('@/views/system/workflow/launch/index'),
      name: 'WorkflowLaunch',
      meta: { title: '发起申请', icon: 'workflowLaunch', permission: ['workflowLaunch'] }
    },
    {
      path: 'apply',
      component: () => import('@/views/system/workflow/apply/index'),
      name: 'WorkflowApply',
      meta: { title: '我的申请', icon: 'workflowApply', permission: ['workflowApply'] }
    },
    {
      path: 'todo',
      component: () => import('@/views/system/workflow/todo/index'),
      name: 'WorkflowTodo',
      meta: { title: '我的待办', icon: 'workflowTodo', permission: ['workflowTodo'] }
    },
    {
      path: 'done',
      component: () => import('@/views/system/workflow/done/index'),
      name: 'WorkflowDone',
      meta: { title: '我的已办', icon: 'workflowDone', permission: ['workflowDone'] }
    }
  ]
}
export default systemWorkflowRouter
