<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useBlogStore } from '@/stores/blog';

const blogStore = useBlogStore();
let subscription: any = null;

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(async () => {
  await blogStore.fetchBlogs();
  subscription = blogStore.subscribeToBlogCreated();
});



onUnmounted(() => {
  if (subscription) {
    subscription.unsubscribe();
  }
});
</script>

<template>
  <div class="blog-list">
    <div class="blog-header">
      <h2>Latest Blog Posts</h2>
    </div>

    <div v-if="blogStore.loading" class="loading">
      Loading blogs...
    </div>

    <div v-if="blogStore.error" class="error">
      {{ blogStore.error }}
    </div>

    <div v-if="!blogStore.loading && blogStore.blogs.length === 0" class="no-blogs">
      No blog posts yet. Be the first to create one!
    </div>

    <div class="blogs">
      <article 
        v-for="blog in blogStore.blogs" 
        :key="blog.id"
        class="blog-card"
      >
        <header class="blog-header">
          <h3>{{ blog.title }}</h3>
          <div class="blog-meta">
            <span class="author">By {{ blog.author.name }}</span>
            <span class="date">{{ formatDate(blog.createdAt) }}</span>
          </div>
        </header>

        <div class="blog-content">
          <p>{{ blog.content }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.blog-list {
  padding: 2rem;
}

.blog-list h2 {
  color: #2d3748;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.blog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.blog-header h2 {
  margin-bottom: 0;
  flex: 1;
  text-align: left;
}

.loading, .error, .no-blogs {
  text-align: center;
  padding: 3rem 2rem;
  margin: 1rem 0;
  border-radius: 12px;
}

.loading {
  color: #4a5568;
  font-size: 1.1rem;
  background: linear-gradient(45deg, transparent 30%, rgba(102, 126, 234, 0.1) 50%, transparent 70%);
  background-size: 200% 200%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.error {
  color: #e53e3e;
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  border: 1px solid #feb2b2;
  font-weight: 500;
}

.error::before {
  content: '⚠️';
  display: block;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.no-blogs {
  color: #718096;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  font-size: 1.1rem;
  font-weight: 500;
}

.no-blogs::before {
  content: '📝';
  display: block;
  font-size: 3rem;
  margin-bottom: 1rem;
}

.blogs {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .blogs {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  }
}

@media (max-width: 640px) {
  .blog-header {
    flex-direction: column;
    text-align: center;
  }
  
  .blog-header h2 {
    text-align: center;
  }
}

.blog-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.blog-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.blog-header {
  margin-bottom: 1.5rem;
}

.blog-header h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.3;
}

.blog-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  color: #718096;
}

.blog-meta .author {
  font-weight: 600;
  color: #4a5568;
}

.blog-meta .author::before {
  content: '👤';
  margin-right: 0.25rem;
}

.blog-meta .date::before {
  content: '📅';
  margin-right: 0.25rem;
}

.blog-content p {
  margin: 0;
  line-height: 1.7;
  color: #4a5568;
  white-space: pre-wrap;
  font-size: 1rem;
}
</style>
