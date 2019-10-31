module.exports = {
  db: {
    host: '192.168.39.36',
    user: 'root',
    password: 'root',
    database: 'submarine'
  },
  mixin: {
    module: 'system',
    entity: '',
    Entity: ''
  },
  fields: [
    {
      title: '下拉选择示范',
      name: 'enable',
      default: 'enable',
      type: 'select',
      options: [
        { label: '启用', value: 'enable' },
        { label: '冻结', value: 'disable' }
      ]
    },
    {
      title: '输入框示范',
      name: 'address',
      default: '',
      type: 'input'
    }
  ],
  input: {
    dir: './templates/'
  },
  output: [
    {
      template: 'form.ejs',
      path: './src/views/<%= module %>/<%= entity %>/form.vue'
    },
    {
      template: 'index.ejs',
      path: './src/views/<%= module %>/<%= entity %>/index.vue'
    },
    {
      template: 'api.ejs',
      path: './src/api/<%= entity %>.js'
    }
  ]
}
