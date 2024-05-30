import { createWebHistory, createRouter } from 'vue-router';

import AppMain from '@/components/pages/AppMain.vue';
import AppContent from '@/components/pages/AppContent.vue';
import AppCategory from '@/components/pages/AppCategory.vue';
import AppSearch from '@/components/pages/AppSearch.vue';
import AppGuestbook from '@/components/pages/AppGuestbook.vue';
import AppNotice from '@/components/pages/AppNotice.vue';
import AppNoticeContent from '@/components/pages/AppNoticeContent.vue';
import NotFoundPage from '@/components/pages/404.vue';

import { spinnerControl } from '@/utils/spinner-control';

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
    path: '/category/:categoryPath+',
    component: AppCategory,
  },
  {
    path: '/search/:keyword',
    component: AppSearch,
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
    path: '/notice',
    component: AppNotice,
  },
  {
    path: '/notice/:noticeId',
    component: AppNoticeContent,
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

router.beforeEach(() => {
  const { setLoading } = spinnerControl();
  setLoading(true);
});

export default router;
