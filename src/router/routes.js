import HomePage from '@/views/HomePage.vue';
import { useThreadsStore } from '@/stores/ThreadsStore';

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: () => import('@/views/ThreadShowPage.vue'),
    props: true,
    beforeEnter(to, from, next) {
      const threadsStore = useThreadsStore();
      const isThreadExists = Boolean(threadsStore.getThreadById(to.params.id));
      if (isThreadExists) {
        return next();
      }
      return next({
        name: 'NotFound',
        params: { pathMatch: to.path.substring(1).split('/') },
        query: to.query,
        hash: to.hash,
      });
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'),
  },
];
