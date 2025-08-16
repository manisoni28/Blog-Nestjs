import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apolloClient } from '@/apollo/client';
import { gql } from '@apollo/client/core';
import type { Blog } from '@/types';

const BLOGS_QUERY = gql`
  query Blogs {
    blogs {
      id
      title
      content
      createdAt
      author {
        id
        name
        email
      }
    }
  }
`;

const CREATE_BLOG_MUTATION = gql`
  mutation CreateBlog($input: CreateBlogInput!) {
    createBlog(input: $input) {
      id
      title
      content
      createdAt
      author {
        id
        name
        email
      }
    }
  }
`;

const BLOG_CREATED_SUBSCRIPTION = gql`
  subscription BlogCreated {
    blogCreated {
      id
      title
      content
      createdAt
      author {
        id
        name
        email
      }
    }
  }
`;

export const useBlogStore = defineStore('blog', () => {
  const blogs = ref<Blog[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchBlogs = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await apolloClient.query({
        query: BLOGS_QUERY,
        fetchPolicy: 'cache-first'
      });

      blogs.value = data.blogs;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const createBlog = async (title: string, content: string) => {
    error.value = null;

    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_BLOG_MUTATION,
        variables: {
          input: { title, content }
        },
        update: (cache, { data: mutationData }) => {
          // Update the cache with the new blog
          const existingBlogs = cache.readQuery<{ blogs: Blog[] }>({ query: BLOGS_QUERY });
          if (existingBlogs && mutationData?.createBlog) {
            cache.writeQuery({
              query: BLOGS_QUERY,
              data: {
                blogs: [mutationData.createBlog, ...existingBlogs.blogs]
              }
            });
          }
        },
        refetchQueries: [
          {
            query: BLOGS_QUERY,
            fetchPolicy: 'cache-first'
          }
        ]
      });

      // Also update local state
      if (data?.createBlog) {
        blogs.value = [data.createBlog, ...blogs.value];
      }
      
      return true;
    } catch (err: any) {
      error.value = err.message;
      return false;
    }
  };

  const subscribeToBlogCreated = () => {
    const subscription = apolloClient.subscribe({
      query: BLOG_CREATED_SUBSCRIPTION
    });

    return subscription.subscribe({
      next: ({ data }) => {
        const newBlog = data.blogCreated;
        // Check if blog already exists to avoid duplicates
        if (!blogs.value.find(blog => blog.id === newBlog.id)) {
          // Create a new array to avoid mutation issues
          blogs.value = [newBlog, ...blogs.value];

          // Show notification
          showNotification(`New blog post: "${newBlog.title}" by ${newBlog.author.name}`);
        }
      },
      error: (err) => {
        console.error('Subscription error:', err);
        // Don't show error to user for subscription issues
      }
    });
  };

  const showNotification = (message: string) => {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      z-index: 1000;
      max-width: 300px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    blogs,
    loading,
    error,
    fetchBlogs,
    createBlog,
    clearError,
    subscribeToBlogCreated
  };
});
