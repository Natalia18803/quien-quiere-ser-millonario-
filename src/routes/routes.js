import {createRouter, createWebHistory} from 'vue-router';

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/game', name: 'game', component: () => import('../views/gameView.vue') },
  { path: '/score', name: 'score', component: () => import('../views/ScoreView.vue') }
]
export default routes
export const router = createRouter({
    history: createWebHistory(),
    routes
})
