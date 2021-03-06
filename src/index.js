import 'babel-polyfill';
import component from './cropper.vue';

export function install(Vue) {
	if (install.installed) return;
	install.installed = true;
	Vue.component('cropper', component);
}

const plugin = {
	install,
};

var GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

export default component;