<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const emit = defineEmits(['switch-to-login']);
const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  name: '',
  email: '',
  password: ''
});

onMounted(() => {
  // Clear any previous errors when component mounts
  authStore.clearError();
});

const handleRegister = async () => {
  const success = await authStore.register(form.email, form.password, form.name);
  if (success) {
    router.push('/dashboard');
  }
};
</script>

<template>
  <div class="auth-form">
    <h2>Register</h2>

    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name">Name:</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          :disabled="authStore.loading"
        />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          :disabled="authStore.loading"
        />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          minlength="6"
          :disabled="authStore.loading"
        />
      </div>

      <div v-if="authStore.error" class="error">
        {{ authStore.error }}
      </div>

      <button 
        type="submit" 
        :disabled="authStore.loading"
        class="btn btn-primary"
      >
        {{ authStore.loading ? 'Registering...' : 'Register' }}
      </button>
    </form>

    <p class="auth-link">
      Already have an account? 
      <a href="#" @click.prevent="$emit('switch-to-login')">Login</a>
    </p>
  </div>
</template>

<style scoped>
.auth-form {
  padding: 2.5rem;
  background: transparent;
}

.auth-form h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2d3748;
  font-size: 1.875rem;
  font-weight: 700;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f7fafc;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

input:hover {
  border-color: #cbd5e0;
}

.btn {
  width: 100%;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.error {
  color: #e53e3e;
  margin-bottom: 1.5rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  background-color: #fed7d7;
  border: 1px solid #feb2b2;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
}

.error::before {
  content: '⚠️';
  margin-right: 0.5rem;
}

.auth-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #718096;
}

.auth-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.auth-link a:hover {
  color: #764ba2;
  text-decoration: underline;
}
</style>
