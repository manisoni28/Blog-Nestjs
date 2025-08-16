<template>
  <div class="create-blog">
    <h2>Create New Blog Post</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title:</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          maxlength="100"
          :disabled="submitting"
          placeholder="Enter your blog title..."
        />
      </div>

      <div class="form-group">
        <label for="content">Content:</label>
        <textarea
          id="content"
          v-model="form.content"
          required
          rows="10"
          :disabled="submitting"
          placeholder="Write your blog content here..."
        ></textarea>
      </div>

      <div v-if="blogStore.error" class="error">
        {{ blogStore.error }}
      </div>

      <div class="form-actions">
        <button 
          type="submit" 
          :disabled="submitting || !form.title.trim() || !form.content.trim()"
          class="btn btn-primary"
        >
          {{ submitting ? 'Publishing...' : 'Publish Blog' }}
        </button>

        <button 
          type="button" 
          @click="resetForm"
          :disabled="submitting"
          class="btn btn-secondary"
        >
          Clear
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useBlogStore } from '@/stores/blog';

const emit = defineEmits(['blog-created']);
const blogStore = useBlogStore();
const submitting = ref(false);

const form = reactive({
  title: '',
  content: ''
});

const handleSubmit = async () => {
  submitting.value = true;
  // Clear any previous errors
  blogStore.clearError();

  try {
    const success = await blogStore.createBlog(form.title.trim(), form.content.trim());
    if (success) {
      resetForm();
      // Show success message
      showSuccessMessage('Blog post published successfully!');
      
      // Emit an event to notify parent component
      emit('blog-created');
    }
  } catch (err) {
    console.error('Error creating blog:', err);
  } finally {
    submitting.value = false;
  }
};

const resetForm = () => {
  form.title = '';
  form.content = '';
};

const showSuccessMessage = (message: string) => {
  const toast = document.createElement('div');
  toast.className = 'success-toast';
  toast.innerHTML = `🎉 ${message}`;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    z-index: 1000;
    box-shadow: 0 8px 32px rgba(72, 187, 120, 0.3);
    font-weight: 600;
    font-size: 0.875rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: slideInFromRight 0.3s ease;
  `;

  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInFromRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInFromRight 0.3s ease reverse';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, 300);
  }, 3000);
};
</script>

<style scoped>
.create-blog {
  padding: 2rem;
}

.create-blog h2 {
  color: #2d3748;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

input, textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  background-color: #f7fafc;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

input:hover, textarea:hover {
  border-color: #cbd5e0;
}

input::placeholder, textarea::placeholder {
  color: #a0aec0;
  font-style: italic;
}

textarea {
  resize: vertical;
  min-height: 240px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
  line-height: 1.6;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.btn {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  min-width: 140px;
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

.btn-secondary {
  background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(113, 128, 150, 0.3);
}

.btn-secondary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(113, 128, 150, 0.4);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
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
  padding: 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  border: 1px solid #feb2b2;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.error::before {
  content: '⚠️';
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

@media (max-width: 640px) {
  .create-blog {
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
