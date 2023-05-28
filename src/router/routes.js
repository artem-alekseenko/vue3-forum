import HomePage from '@/views/HomePage.vue';
import { useThreadsStore } from '@/stores/ThreadsStore';

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/me',
    name: 'Profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: { toTop: true, smoothScroll: true },
  },
  {
    path: '/me/edit',
    name: 'ProfileEdit',
    component: () => import('@/views/ProfilePage.vue'),
    props: { edit: true },
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: () => import('@/views/CategoryPage.vue'),
    props: true,
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    component: () => import('@/views/ForumPage.vue'),
    props: true,
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    component: () => import('@/views/ThreadShowPage.vue'),
    props: true,
    async beforeEnter(to, from, next) {
      // TODO: transfer thread to component
      const threadsStore = useThreadsStore();
      const thread = await threadsStore.thread(to.params.id);
      const isThreadExists = Boolean(thread);
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
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: () => import('@/views/ThreadCreatePage.vue'),
    props: true,
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: () => import('@/views/ThreadEditPage.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'),
  },
];
