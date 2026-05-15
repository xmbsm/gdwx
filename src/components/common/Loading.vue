<template>
  <div class="loading" :style="{ '--size': size, '--color': color }">
    <div class="loading-spinner">
      <div class="spinner-circle"></div>
    </div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: '40px'
  },
  color: {
    type: String,
    default: 'var(--color-accent)'
  },
  text: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  gap: var(--spacing-md);
}

.loading-spinner {
  width: var(--size);
  height: var(--size);
}

.spinner-circle {
  width: 100%;
  height: 100%;
  border: 3px solid var(--color-border);
  border-top-color: var(--color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: var(--color-secondary);
}
</style>
