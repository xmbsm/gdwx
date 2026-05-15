<template>
  <div class="classics-view">
    <Breadcrumb :items="[{ name: '名著', path: '/classics' }]" />
    
    <div class="page-content">
      <div class="container">
        <header class="page-header">
          <h1 class="page-title">名著</h1>
          <p class="page-desc">中国古典小说的巅峰之作，代表了古典文学的最高成就</p>
        </header>
        
        <div class="classics-grid" v-if="paginatedClassics.length">
          <BookCard 
            v-for="classic in paginatedClassics" 
            :key="classic.id" 
            :book="classic"
            type="classics"
          />
        </div>

        <div class="pagination" v-if="totalPages > 1">
          <button 
            class="page-btn" 
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            上一页
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button 
            class="page-btn" 
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useClassicsStore } from '../stores/classics.js'
import Breadcrumb from '../components/common/Breadcrumb.vue'
import BookCard from '../components/content/BookCard.vue'

const classicsStore = useClassicsStore()
const currentPage = ref(1)
const pageSize = 20

const classicsList = computed(() => classicsStore.classicsList)

const totalPages = computed(() => Math.ceil(classicsList.value.length / pageSize))

const paginatedClassics = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return classicsList.value.slice(start, end)
})

watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.classics-view {
  padding-top: var(--header-height);
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xxl);
  padding-top: var(--spacing-xl);
}

.page-title {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.page-desc {
  font-size: 18px;
  color: var(--color-secondary);
}

.classics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xxl);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xxl);
  padding: var(--spacing-xl) 0;
}

.page-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: var(--color-secondary);
}

@media (max-width: 1024px) {
  .classics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .classics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
