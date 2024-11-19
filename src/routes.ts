import About from './pages/About.vue'
import Home from './pages/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
