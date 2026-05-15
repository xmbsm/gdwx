import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/classics',
      name: 'classics',
      component: () => import('../views/ClassicsView.vue'),
      meta: { title: '名著' }
    },
    {
      path: '/classics/:id',
      name: 'classic-detail',
      component: () => import('../views/ClassicDetailView.vue'),
      meta: { title: '名著详情', showBreadcrumb: true }
    },
    {
      path: '/poems',
      name: 'poems',
      component: () => import('../views/PoemsView.vue'),
      meta: { title: '诗词' }
    },
    {
      path: '/poems/:id',
      name: 'poem-detail',
      component: () => import('../views/PoemDetailView.vue'),
      meta: { title: '诗词详情', showBreadcrumb: true }
    },
    {
      path: '/works/:id',
      name: 'work-detail',
      component: () => import('../views/WorkDetailView.vue'),
      meta: { title: '作品详情', showBreadcrumb: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: '关于站点' }
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/LibraryView.vue'),
      meta: { title: '书库' }
    },
    {
      path: '/authors',
      name: 'authors',
      component: () => import('../views/AuthorsView.vue'),
      meta: { title: '作者' }
    },
    {
      path: '/authors/:name',
      name: 'author-detail',
      component: () => import('../views/AuthorDetailView.vue'),
      meta: { title: '作者详情', showBreadcrumb: true }
    },
    {
      path: '/yiyan',
      name: 'yiyan',
      component: () => import('../views/YiyanView.vue'),
      meta: { title: '一言' }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
      meta: { title: '搜索结果' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: '页面未找到' }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  console.log('Navigation from:', from.path, 'to:', to.path)
  document.title = `${to.meta.title || '古典文学'} - 中国古典文学名著网`
  next()
})

export default router
