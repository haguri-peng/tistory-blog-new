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
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      let scrollTimeout = 10;
      if (from.path != to.path) {
        // path가 다른 경우 timeout을 1초로 설정
        scrollTimeout = 1000;
      }
      setTimeout(() => {
        if (savedPosition && savedPosition.top > 0) {
          // refresh 하는 경우도 savedPosition이 존재함
          resolve(savedPosition);
        } else {
          if (to.hash) {
            // 헤더 영역의 높이를 감안해서 top을 80 설정
            resolve({ el: to.hash, behavior: 'smooth', top: 80 });
          }
          resolve({ left: 0, top: 0 });
        }
      }, scrollTimeout);
    });
  },
});

router.beforeEach((to, from, next) => {
  const { setLoading } = spinnerControl();

  if (from.path == to.path) {
    if (to.hash) {
      const targetElement = document.querySelector(to.hash);
      if (targetElement) {
        next();
      }
    } else {
      next();
    }
  } else {
    setLoading(true);
    next();
  }
});

export default router;
