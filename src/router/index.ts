import { createWebHistory, createRouter } from 'vue-router';

import AppMain from '@/components/AppMain.vue';
import AppContent from '@/components/AppContent.vue';
import AppCategory from '@/components/AppCategory.vue';
import AppSearch from '@/components/AppSearch.vue';
import AppGuestbook from '@/components/AppGuestbook.vue';
import NotFoundPage from '@/components/404.vue';

const routes = [
  {
    path: '/',
    component: AppMain,
  },
  {
    path: '/:id',
    component: AppContent,
  },
  {
    path: '/category/:categoryId',
    component: AppCategory,
  },
  {
    path: '/search/:type/:keyword',
    component: AppSearch,
  },
  {
    path: '/guestbook',
    component: AppGuestbook,
  },
  {
    path: '/:pathMatch(.*)*',
    // redirect: '/404',
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
