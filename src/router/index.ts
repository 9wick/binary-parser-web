import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import BleAdvertisement from '@/views/BleAdvertisement.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/ble-adv',
  },
  {
    path: '/ble-adv',
    name: 'BleAdv',
    component: BleAdvertisement,
  },
  {
    path: '/ble-hci',
    name: 'BleHci',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/BleHci.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
