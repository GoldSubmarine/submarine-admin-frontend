<template>
  <component
    :is="formKey"
    :mode="mode"
    :process-instance-id="processInstanceId"
    :task-id="taskId"
    :task-definition-key="taskDefinitionKey"
    :process-definition-id="processDefinitionId"
    @refresh="$emit('refresh')"
    @close="$emit('close')"
  />
</template>

<script>
import flowLeaveForm from '@/views/system/workflow/flowLeave/form'

export default {
  components: {
    [flowLeaveForm.formKey]: flowLeaveForm
  },
  props: {
    formKey: {
      type: String,
      required: true
    },
    mode: { // add, approve
      type: String,
      required: true
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
    },
    processDefinitionId: {
      type: String,
      default: null
    }
  },
  data() {
    return {}
  }
}
</script>
