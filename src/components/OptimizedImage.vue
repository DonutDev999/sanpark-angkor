<template>
  <img 
    :src="currentSrc"
    :alt="alt"
    :class="imageClass"
    :loading="loading"
    @error="handleImageError"
    @load="handleImageLoad"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getPlaceholderImage } from '../utils/placeholderImages';

interface Props {
  src: string;
  alt: string;
  imageKey?: string;
  category?: 'hero' | 'tours' | 'temples' | 'thumbnails';
  class?: string;
  loading?: 'lazy' | 'eager';
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  class: ''
});

const currentSrc = ref(props.src);
const hasError = ref(false);
const isLoaded = ref(false);

const imageClass = computed(() => {
  const baseClasses = props.class;
  const statusClasses = hasError.value ? 'opacity-75' : isLoaded.value ? 'opacity-100' : 'opacity-0';
  return `${baseClasses} transition-opacity duration-300 ${statusClasses}`;
});

const handleImageError = () => {
  console.warn(`Image failed to load: ${currentSrc.value}`);
  hasError.value = true;
  
  // Fallback to placeholder if we have the necessary info
  if (props.category && props.imageKey) {
    currentSrc.value = getPlaceholderImage(props.category, props.imageKey);
  } else {
    // Generic fallback
    currentSrc.value = 'https://picsum.photos/800/600?random=99&blur=1';
  }
};

const handleImageLoad = () => {
  isLoaded.value = true;
  hasError.value = false;
};

onMounted(() => {
  // Pre-check if image exists in development mode
  if (import.meta.env.DEV && props.category && props.imageKey) {
    currentSrc.value = getPlaceholderImage(props.category, props.imageKey);
  }
});
</script>

<style scoped>
img {
  transition: opacity 0.3s ease-in-out;
}
</style>