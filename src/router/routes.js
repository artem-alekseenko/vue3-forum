import HomePage from '@/views/HomePage.vue';

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
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'),
  },
];
