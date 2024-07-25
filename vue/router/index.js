import { createRouter, createWebHistory } from 'vue-router';
import login from '@/views/login.vue';
import home from '@/views/home.vue';
import post from '@/views/post.vue';
import profile from '@/views/profile.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: home
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/profile/:username',
      component: profile
    },
    { 
      path: '/post/:id', 
      component: post
    },
    {
      path: '/:404',
      redirect: '/'
    }
  ]
})

export default router
