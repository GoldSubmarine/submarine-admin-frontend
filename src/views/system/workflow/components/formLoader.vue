<template>
  <component
    :is="processDefinitionKey"
    :mode="mode"
    :process-instance-id="processInstanceId"
    :process-definition-key="processDefinitionKey"
    :process-definition-id="processDefinitionId"
    :task-id="taskId"
    :task-definition-key="taskDefinitionKey"
    @refresh="$emit('refresh')"
    @close="$emit('close')"
  />
</template>

<script>
import flowLeaveForm from '@/views/system/workflow/flowLeave/form'

export default {
  components: {
    [flowLeaveForm.name]: flowLeaveForm
  },
  props: {
    mode: { // add, approve, detail
      type: String,
      required: true
    },
    processDefinitionId: {
      type: String,
      default: null
    },
    processDefinitionKey: {
      type: String,
      default: null
    },
    processInstanceId: {
      type: String,
      default: null
    },
    taskId: {
      type: String,
      default: null
    },
    taskDefinitionKey: {
      type: String,
      default: null
    }
  },
  data() {
    return {}
  }
}
</script>
