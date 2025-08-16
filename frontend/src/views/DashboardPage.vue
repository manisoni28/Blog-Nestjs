<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import BlogList from '@/components/blog/BlogList.vue';
import CreateBlog from '@/components/blog/CreateBlog.vue';

const authStore = useAuthStore();
const router = useRouter();
const currentView = ref<'blogs' | 'create'>('blogs');

onMounted(async () => {
  // Initialize authentication state
  await authStore.initializeAuth();
  
  if (!authStore.isAuthenticated) {
    router.push('/auth');
    return;
  }

  // Fetch user data if not available
  if (!authStore.user) {
    await authStore.fetchUser();
  }
});

const handleBlogCreated = () => {
  currentView.value = 'blogs';
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/auth');
};
</script>


<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>Blog Platform</h1>
        <div class="user-info">
          <span>Welcome, {{ authStore.user?.name }}!</span>
          <button @click="handleLogout" class="btn btn-outline">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <nav class="dashboard-nav">
        <button 
          @click="currentView = 'blogs'"
          :class="['nav-btn', { active: currentView === 'blogs' }]"
        >
          All Blogs
        </button>
        <button 
          @click="currentView = 'create'"
          :class="['nav-btn', { active: currentView === 'create' }]"
        >
          Create Blog
        </button>
      </nav>

      <div class="dashboard-content">
        <BlogList v-if="currentView === 'blogs'" />
        <CreateBlog v-else @blog-created="handleBlogCreated" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.dashboard-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.header-content h1 {
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.75rem;
  font-weight: 700;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info span {
  color: #4a5568;
  font-weight: 500;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.btn-outline {
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
}

.btn-outline:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.dashboard-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 0.875rem 1.75rem;
  border: 2px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  color: #4a5568;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.dashboard-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .dashboard-nav {
    justify-content: center;
  }
  
  .nav-btn {
    flex: 1;
    min-width: 120px;
  }
}
</style>
