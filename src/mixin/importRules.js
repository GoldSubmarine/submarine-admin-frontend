import * as ruleListAll from '../utils/rules';

export default {
	install: function(Vue, options) {
		Vue.mixin({
			methods: {
				importRules(...names) {
          let result = [];
          names.forEach(name => {
              result = result.concat(ruleListAll[name]);
          });
          return result;
				}
			}
		})
	}
};
