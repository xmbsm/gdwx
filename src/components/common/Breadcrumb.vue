<template>
  <div class="breadcrumb">
    <div class="breadcrumb-container">
      <router-link to="/" class="breadcrumb-item">
        <span class="breadcrumb-icon">🏠</span>
        <span class="breadcrumb-text">首页</span>
      </router-link>
      
      <template v-for="(item, index) in items" :key="index">
        <span class="breadcrumb-separator">/</span>
        <router-link 
          v-if="item.path" 
          :to="item.path" 
          class="breadcrumb-item"
        >
          <span class="breadcrumb-text">{{ item.name }}</span>
        </router-link>
        <span v-else class="breadcrumb-item is-current">
          <span class="breadcrumb-text">{{ item.name }}</span>
        </span>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.breadcrumb {
  padding: var(--spacing-md) 0;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
}

.breadcrumb-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 14px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.breadcrumb-item:hover {
  color: var(--color-accent);
}

.breadcrumb-item.is-current {
  color: var(--color-primary);
  font-weight: 500;
}

.breadcrumb-icon {
  font-size: 12px;
}

.breadcrumb-separator {
  color: var(--color-divider);
}

@media (max-width: 768px) {
  .breadcrumb-container {
    padding: 0 var(--spacing-md);
    font-size: 13px;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
