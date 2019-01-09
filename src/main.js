// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import Vuetify from 'vuetify';
import router from '@/router/index';
import 'font-awesome/css/font-awesome.css';  
import './theme/default.styl';
import { getRequest, postRequest, putRequest, deleteRequest, uploadFileRequest, postBodyRequest, putBodyRequest } from '@/api/api';
import VeeValidate from 'vee-validate';
import colors from 'vuetify/es5/util/colors';
import Truncate from 'lodash.truncate';
import MultiFiltersPlugin from '@/util/MultiFilters';
import store from './store';
import util from '@/libs/util';
Vue.config.productionTip = false;
// request
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.uploadFileRequest = uploadFileRequest;
Vue.prototype.postBodyRequest = postBodyRequest;
Vue.prototype.putBodyRequest = putBodyRequest;
// Helpers
// Global filters
Vue.filter('truncate', Truncate);
Vue.use(MultiFiltersPlugin);
Vue.use(VeeValidate, { fieldsBagName: 'formFields' });
Vue.use(Vuetify, {
  // theme: {
  //   primary: colors.indigo.base, // #E53935
  //   secondary: colors.indigo.lighten4, // #FFCDD2
  //   accent: colors.indigo.base // #3F51B5
  // },
  options: {
    themeVariations: ['primary', 'secondary', 'accent'],
    extra: {
      mainToolbar: {
        color: 'primary',
      },
      sideToolbar: {
      },
      sideNav: 'primary',
      mainNav: 'primary lighten-1',
      bodyBg: '',
    }
  }
});
// Bootstrap application components



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  store: store,
  mounted () {
    // 初始化菜单
    util.initRouter(this);
    this.currentPageName = this.$route.name;
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList');
    this.$store.commit('initCachepage');
  },
  template: '<App/>',
});
