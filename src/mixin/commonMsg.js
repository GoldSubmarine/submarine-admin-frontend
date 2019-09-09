import { MessageBox, Message } from 'element-ui'

export default {
	install: function(Vue, options) {
		Vue.mixin({
			methods: {
				delConfirm() {
          return MessageBox.confirm('此操作将永久删除该记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
				},
				commonConfirm(msg) {
          return MessageBox.confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
				},
			}
		})
	}
};
