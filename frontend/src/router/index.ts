import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AuthPage from '@/views/AuthPage.vue';
import DashboardPage from '@/views/DashboardPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // If going to auth page and already authenticated, redirect to dashboard
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard');
    return;
  }

  // If going to protected route and not authenticated, redirect to auth
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Check if we have a token but no user data
    if (authStore.token && !authStore.user) {
      try {
        await authStore.fetchUser();
        if (authStore.isAuthenticated) {
          next();
          return;
        }
      } catch (err) {
        // If fetchUser fails, clear auth and redirect to login
        await authStore.logout();
      }
    }
    next('/auth');
    return;
  }

  next();
});

export default router;
