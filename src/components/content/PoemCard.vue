<template>
  <router-link :to="`/poems/${poem.id}`" class="poem-card">
    <div class="card-content">
      <h3 class="card-title">{{ poem.title }}</h3>
      <div class="card-meta">
        <span class="author">{{ poem.author }}</span>
        <span class="separator">·</span>
        <span class="dynasty">{{ poem.dynasty }}</span>
        <span class="separator">·</span>
        <span class="category">{{ poem.category }}</span>
      </div>
      <p class="card-famous-lines text-ellipsis-2">"{{ poem.famousLines }}"</p>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  poem: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.poem-card {
  display: block;
  background: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  text-decoration: none;
  color: inherit;
}

.poem-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.card-content {
  padding: var(--spacing-lg);
  border-top: 4px solid var(--color-accent);
}

.card-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 14px;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-md);
}

.separator {
  opacity: 0.5;
}

.card-famous-lines {
  font-family: var(--font-classical);
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-primary);
  font-style: italic;
}

.category {
  color: var(--color-accent);
}

@media (max-width: 768px) {
  .card-content {
    padding: var(--spacing-md);
  }

  .card-title {
    font-size: 16px;
  }
}
</style>
