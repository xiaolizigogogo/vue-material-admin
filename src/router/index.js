import Vue from 'vue';
import Router from 'vue-router';
import { routers, otherRouter } from './paths';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Cookies from 'js-cookie';
import Util from '../libs/util';
Vue.use(Router);
export const router =  new Router({
  base: '/',
  mode: 'hash',
  linkActiveClass: 'active',
  routes: routers
});
// router gards
router.beforeEach((to, from, next) => {
  NProgress.start();
  Util.title(to.meta.title);
  if (Cookies.get('locking') === '1' && to.name !== 'locking') {
    // 判断当前是否是锁定状态
    next({
      replace: true,
      name: 'locking'
    });
  } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
    next(false);
  } else {
    if (!Cookies.get('userInfo') && to.name !== 'login' && to.name !== 'regist' && to.name !== 'regist-result') { // 判断是否已经登录且前往的页面不是登录页
      next({
        name: 'Login'
      });
    } else if (Cookies.get('userInfo') && to.name === 'login') {
      // 判断是否已经登录且前往的是登录页
      Util.title();
      next({
        name: 'Root'
      });
    } else {
      Util.toDefaultPage([...routers], to.name, router, next);
    }
  }
});

router.afterEach((to, from) => {
  // ...
  NProgress.done();
  window.scrollTo(0, 0);
});

export default router;