import App from '@/App.vue';
export const page404 = {
  path: '/404',
  meta: {
    public: true,
  },
  name: 'NotFound',
  component: () => import(
    /* webpackChunkName: "routes" */
    /* webpackMode: "lazy-once" */
    `@/pages/NotFound.vue`
  )
};
export const page403 = {
  path: '/403',
  meta: {
    public: true,
  },
  name: 'AccessDenied',
  component: () => import(
    /* webpackChunkName: "routes" */
    /* webpackMode: "lazy-once" */
    `@/pages/Deny.vue`
  )
};
export const page500 = {
  path: '/500',
  meta: {
    public: true,
  },
  name: 'ServerError',
  component: () => import(
    /* webpackChunkName: "routes" */
    /* webpackMode: "lazy-once" */
    `@/pages/Error.vue`
  )
};
export const loginRouter = {
  path: '/login',
  meta: {
    public: true,
  },
  name: 'Login',
  component: () => import(
    /* webpackChunkName: "routes" */
    /* webpackMode: "lazy-once" */
    `@/pages/Login.vue`
  )
};
export const appRouter = [
  {
    path: '/',
    meta: { },
    name: 'Root',
    redirect: {
      name: 'Dashboard'
    }
  },
  {
    path: '/dashboard',
    meta: { breadcrumb: true },
    name: 'Dashboard',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      `@/pages/Dashboard.vue`
    )
  },
];
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: App,
  children: [],
};

export const routers = [
  loginRouter,
  otherRouter,
  ...appRouter,
  page500,
  page403,
  page404
];