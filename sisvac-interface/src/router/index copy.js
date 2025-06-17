import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import HomePage from '@/views/HomePage.vue' // você pode criar isso depois

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/',
    redirect: '/login' // redireciona para login por padrão
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router