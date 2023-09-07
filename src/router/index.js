import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/index/Index.vue'),
      meta: {
        title: 'Easy Doc',
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/Index.vue'),
      meta: {
        title: '登录',
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/register/Index.vue'),
      meta: {
        title: '注册',
      }
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/user/Index.vue'),
      meta: {
        title: 'Easy Doc',
      }
    },
    {
      path: '/project/:project_id',
      name: 'project',
      component: () => import('../views/project/Project.vue'),
      meta: {
        title: 'Easy Doc',
      },
      children:[
        {
          path: '',
          name: 'project-index',
          component: () => import('../views/project/Index.vue'),
          meta: {
            title: 'Easy Doc',
          }
        },
        {
          path: 'api/:api_id',
          name: 'api',
          component: () => import('../views/api/Index.vue'),
          meta: {
            title: 'Easy Doc',
          }
        },
        {
          path: 'edit/:api_id',
          name: 'edit',
          component: () => import('../views/api/Edit.vue'),
          meta: {
            title: 'Easy Doc',
          }
        },
      ]
    },

  ]
})

//全局看守
router.beforeEach((to, from, next) => {
  if (to.meta.title) { // 如果设置标题，拦截后设置标题
    document.title = to.meta.title
  }
  NProgress.start()
  next();
})
router.afterEach((to, from) => {
  NProgress.done()
})

export default router
