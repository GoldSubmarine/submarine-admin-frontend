// 输入框必填
export const inputRequired = [
  { required: true, message: '请输入', trigger: ['blur', 'change'] }
]

// 选择框必填
export const selectRequired = [
  { required: true, message: '请选择', trigger: ['blur', 'change'] }
]

// 邮箱校验
export const email = [
  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
]

// 电话校验
export const phone = [
  { required: true, pattern: /^1[3-9][0-9]{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
]

// 是否是英文逗号分隔
export const segment = [
  { required: true, pattern: /^[\d,]+$/, message: '请用英文逗号分隔数字', trigger: 'blur' }
]

// 是否是整数
export const integer = [
  { pattern: /^\d+$/, message: '必须为整数值', trigger: 'blur' }
]

// 是否是数字，包含小数
export const number = [
  { pattern: /^\d+\.?\d{0,}$/, message: '必须为数字值', trigger: 'blur' }
]

// 是否是 ip
export const ip = [
  { pattern: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, message: '请输入正确的 IP', trigger: 'blur' }
]
