<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import LoginForm from '@/components/auth/LoginForm.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';

const currentView = ref<'login' | 'register'>('login');
const authStore = useAuthStore();

const switchView = (view: 'login' | 'register') => {
  currentView.value = view;
  // Clear any errors when switching views
  authStore.clearError();
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <LoginForm 
        v-if="currentView === 'login'"
        @switch-to-register="switchView('register')"
      />
      <RegisterForm 
        v-else
        @switch-to-login="switchView('login')"
      />
    </div>
  </div>
</template>



<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
}

.auth-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
  opacity: 0.5;
  pointer-events: none;
}

.auth-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 
              0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    rgba(102, 126, 234, 0.05) 0%, 
    rgba(118, 75, 162, 0.05) 100%);
  pointer-events: none;
}

@media (max-width: 480px) {
  .auth-page {
    padding: 1rem 0.5rem;
  }
  
  .auth-container {
    max-width: 100%;
    border-radius: 16px;
  }
}
</style>
