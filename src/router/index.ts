import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/chatContent',
      name: 'chatContent',
      component: () => import('../views/ChatContent.vue')
    },
    {
      path: '/session2',
      name: 'session2',
      component: () => import('../views/Statistics.vue')
    },
    {
      path: '/session3',
      name: 'session3',
      component: () => import('../views/Session3.vue')
    },
    {
      path: '/session4',
      name: 'session4',
      component: () => import('../views/Session4.vue')
    },
  ]
})

export default router
