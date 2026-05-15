<template>
  <router-link :to="linkTo" class="book-card">
    <div class="card-content">
      <h3 class="card-title">{{ book.title }}</h3>
      <p class="card-author">{{ book.author }} · {{ book.dynasty }}</p>
      <p class="card-summary text-ellipsis-2">{{ book.summary }}</p>
      <div class="card-tags" v-if="book.themes">
        <span class="tag" v-for="theme in book.themes.slice(0, 3)" :key="theme">
          {{ theme }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  book: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    default: 'classics'
  }
})

const linkTo = computed(() => {
  return props.type === 'classics' 
    ? `/classics/${props.book.id}.html`
    : `/works/${props.book.id}.html`
})
</script>

<style scoped>
.book-card {
  display: block;
  background: white;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  text-decoration: none;
  color: inherit;
}

.book-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.card-content {
  padding: var(--spacing-lg);
  border-top: 4px solid var(--color-accent);
}

.card-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.card-author {
  font-size: 14px;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-md);
}

.card-summary {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-secondary);
  color: var(--color-secondary);
  font-size: 12px;
  border-radius: var(--radius-sm);
}

@media (max-width: 768px) {
  .card-content {
    padding: var(--spacing-md);
  }

  .card-title {
    font-size: 18px;
  }
}
</style>
