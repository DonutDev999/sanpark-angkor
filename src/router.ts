import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Tours from './components/Tours.vue';
import Contact from './components/Contact.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/tours', component: Tours },
  { path: '/contact', component: Contact },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
