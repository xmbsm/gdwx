<template>
  <div class="poems-view">
    <Breadcrumb :items="[{ name: '诗词', path: '/poems.html' }]" />
    
    <div class="page-content">
      <div class="container">
        <header class="page-header">
          <h1 class="page-title">诗词曲</h1>
          <p class="page-desc">唐诗宋词元曲，千年传颂，领略古典文学之美</p>
        </header>

        <div class="filter-section">
          <div class="filter-group">
            <label class="filter-label">体裁：</label>
            <div class="filter-options">
              <button 
                class="filter-btn"
                :class="{ active: selectedCategory === '' }"
                @click="selectedCategory = ''"
              >
                全部
              </button>
              <button 
                v-for="cat in categories" 
                :key="cat"
                class="filter-btn"
                :class="{ active: selectedCategory === cat }"
                @click="selectedCategory = cat"
              >
                {{ cat }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="poems-grid" v-if="paginatedPoems.length">
          <PoemCard 
            v-for="poem in paginatedPoems" 
            :key="poem.id" 
            :poem="poem"
          />
        </div>
        
        <div class="no-results" v-else>
          <p>暂无诗词</p>
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
import { usePoemsStore } from '../stores/poems.js'
import Breadcrumb from '../components/common/Breadcrumb.vue'
import PoemCard from '../components/content/PoemCard.vue'

const poemsStore = usePoemsStore()
const selectedCategory = ref('')
const currentPage = ref(1)
const pageSize = 20

const categories = computed(() => poemsStore.getAllCategories)
const filteredPoems = computed(() => {
  if (!selectedCategory.value) {
    return poemsStore.poemsList
  }
  return poemsStore.getPoemsByCategory(selectedCategory.value)
})

const totalPages = computed(() => Math.ceil(filteredPoems.value.length / pageSize))

const paginatedPoems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredPoems.value.slice(start, end)
})

watch(selectedCategory, () => {
  currentPage.value = 1
})

watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.poems-view {
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

.filter-section {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.filter-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.filter-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-primary);
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.filter-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.filter-btn.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.no-results {
  text-align: center;
  padding: var(--spacing-xxl);
  color: var(--color-secondary);
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
  .poems-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-options {
    width: 100%;
  }

  .filter-btn {
    flex: 1;
    text-align: center;
  }

  .poems-grid {
    grid-template-columns: 1fr;
  }
}
</style>
