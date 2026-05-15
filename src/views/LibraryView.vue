<template>
  <div class="library-page">
    <div class="library-header">
      <div class="header-tabs">
        <button class="tab-btn active" @click="activeTab = 'library'">书库</button>
        <button class="tab-btn" @click="activeTab = 'special'">专题</button>
      </div>
    </div>
    
    <div class="library-container">
      <div class="sidebar">
        <div class="sidebar-header">
          <span class="sidebar-title">题材分类</span>
        </div>
        
        <div class="category-tree">
          <div 
            v-for="category in categoryTree" 
            :key="category.key"
            class="tree-node"
          >
            <div 
              class="node-header"
              :class="{ active: currentMainCategory === category.key }"
              @click="toggleCategory(category.key)"
            >
              <span class="expand-icon" v-if="category.children.length > 0">
                {{ expandedCategories.includes(category.key) ? '▼' : '▶' }}
              </span>
              <span class="node-name">{{ category.name }}</span>
            </div>
            
            <div 
              v-if="expandedCategories.includes(category.key) && category.children.length > 0"
              class="sub-categories"
            >
              <div 
                v-for="subCat in category.children" 
                :key="subCat"
                class="sub-category"
                :class="{ active: currentSubCategory === subCat && currentMainCategory === category.key }"
                @click="selectSubCategory(category.key, subCat)"
              >
                {{ subCat }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="content-area">
        <div class="content-header">
          <span class="current-category">{{ currentMainCategory === 'all' ? '全部作品' : currentMainCategory }}{{ currentSubCategory && currentMainCategory !== 'all' ? ' > ' + currentSubCategory : '' }}</span>
          <span class="total-count">共 {{ currentBooks.length }} 本</span>
        </div>
        
        <div class="books-grid">
          <router-link 
            v-for="book in paginatedBooks" 
            :key="book.id"
            :to="book.link"
            class="book-card-link"
          >
            <div class="book-card">
              <div class="book-cover-wrapper">
                <div class="book-cover">
                  <div class="book-spine"></div>
                  <div class="book-stamp"></div>
                </div>
              </div>
              <div class="book-info">
                <h3 class="book-title">{{ book.title }}</h3>
                <p class="book-author">{{ book.author }}</p>
                <p class="book-desc">{{ book.summary }}</p>
                <div class="book-tags">
                  <span class="tag">精校</span>
                  <span v-if="book.dynasty" class="tag">{{ book.dynasty }}</span>
                  <span v-if="book.category" class="tag">{{ book.category }}</span>
                </div>
              </div>
            </div>
          </router-link>
          
          <div v-if="currentBooks.length === 0" class="empty-state">
            <p>暂无相关书籍</p>
          </div>
        </div>
        
        <div v-if="totalPages > 1" class="pagination">
          <button 
            class="page-btn" 
            :disabled="currentPage === 1"
            @click="currentPage = 1"
          >
            首页
          </button>
          <button 
            class="page-btn" 
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            上一页
          </button>
          <span class="page-info">
            第 {{ currentPage }} / {{ totalPages }} 页
          </span>
          <button 
            class="page-btn" 
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            下一页
          </button>
          <button 
            class="page-btn" 
            :disabled="currentPage === totalPages"
            @click="currentPage = totalPages"
          >
            末页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useWorksStore } from '../stores/works.js'
import { useClassicsStore } from '../stores/classics.js'
import { usePoemsStore } from '../stores/poems.js'

const worksStore = useWorksStore()
const classicsStore = useClassicsStore()
const poemsStore = usePoemsStore()

const PAGE_SIZE = 20

const activeTab = ref('library')
const currentMainCategory = ref('')
const currentSubCategory = ref('')
const expandedCategories = ref([])
const currentPage = ref(1)

const allBooks = computed(() => {
  return [
    ...classicsStore.classicsList.map(b => ({ ...b, type: 'classics', link: `/classics/${b.id}` })),
    ...poemsStore.poemsList.map(b => ({ ...b, type: 'poems', link: `/poems/${b.id}` })),
    ...worksStore.worksList.map(b => ({ ...b, type: 'works', link: `/works/${b.id}` }))
  ]
})

const categoryTree = computed(() => {
  const categories = [...new Set(allBooks.value.map(b => b.category).filter(Boolean))]
  return [{
    key: 'all',
    name: '全部',
    children: []
  }, ...categories.map(cat => {
    const subcategories = [...new Set(allBooks.value.filter(w => w.category === cat).map(w => w.subcategory).filter(Boolean))]
    return {
      key: cat,
      name: cat,
      children: subcategories
    }
  })]
})

function toggleCategory(key) {
  currentPage.value = 1
  if (key === 'all') {
    currentMainCategory.value = 'all'
    currentSubCategory.value = ''
    return
  }
  
  currentMainCategory.value = key
  
  const index = expandedCategories.value.indexOf(key)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(key)
  }
  
  const category = categoryTree.value.find(c => c.key === key)
  if (category && category.children.length > 0) {
    currentSubCategory.value = category.children[0]
  } else {
    currentSubCategory.value = ''
  }
}

function selectSubCategory(mainKey, subKey) {
  currentPage.value = 1
  currentMainCategory.value = mainKey
  currentSubCategory.value = subKey
}

const currentBooks = computed(() => {
  let books = allBooks.value
  if (currentMainCategory.value && currentMainCategory.value !== 'all') {
    books = books.filter(b => b.category === currentMainCategory.value)
  }
  if (currentSubCategory.value) {
    books = books.filter(b => b.subcategory === currentSubCategory.value)
  }
  return books
})

const totalPages = computed(() => {
  return Math.ceil(currentBooks.value.length / PAGE_SIZE)
})

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  return currentBooks.value.slice(start, end)
})

watch(currentBooks, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
})

watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

currentMainCategory.value = 'all'
</script>

<style scoped>
.library-page {
  min-height: calc(100vh - var(--header-height));
  background: var(--color-bg);
}

.library-header {
  padding-top: var(--header-height);
  border-bottom: 1px solid var(--color-border);
  background: white;
}

.header-tabs {
  display: flex;
  gap: var(--spacing-xl);
  padding: var(--spacing-lg) 0;
  margin-left: calc(var(--sidebar-width) + var(--spacing-xl));
  border-bottom: 2px solid var(--color-border);
}

.tab-btn {
  background: transparent;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-secondary);
  cursor: pointer;
  padding: var(--spacing-sm) 0;
  position: relative;
  transition: color var(--transition-fast);
}

.tab-btn:hover {
  color: var(--color-primary);
}

.tab-btn.active {
  color: var(--color-primary);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
}

.library-container {
  display: flex;
  min-height: calc(100vh - var(--header-height) - 80px);
}

.sidebar {
  width: var(--sidebar-width);
  background: white;
  border-right: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  position: fixed;
  left: 0;
  top: var(--header-height);
  bottom: 0;
  overflow-y: auto;
}

.sidebar-header {
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-md);
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.category-tree {
  font-size: 14px;
}

.tree-node {
  margin-bottom: var(--spacing-xs);
}

.node-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text);
}

.node-header:hover {
  background: var(--color-bg);
}

.node-header.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.expand-icon {
  font-size: 10px;
  margin-right: var(--spacing-sm);
  color: var(--color-secondary);
}

.node-name {
  flex: 1;
}

.sub-categories {
  padding-left: var(--spacing-lg);
}

.sub-category {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-secondary);
}

.sub-category:hover {
  background: var(--color-bg);
  color: var(--color-text);
}

.sub-category.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.content-area {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding: var(--spacing-xl);
  background: var(--color-bg);
}

.content-header {
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-category {
  font-size: 14px;
  color: var(--color-secondary);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
  display: inline-block;
}

.total-count {
  font-size: 14px;
  color: var(--color-secondary);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.book-card {
  display: flex;
  gap: var(--spacing-lg);
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.book-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.book-cover-wrapper {
  flex-shrink: 0;
}

.book-cover {
  width: 80px;
  height: 100px;
  background: linear-gradient(135deg, #f5f0e6 0%, #e8e0d0 100%);
  border-radius: 2px;
  position: relative;
  box-shadow: 3px 3px 8px rgba(0,0,0,0.1);
}

.book-spine {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  background: linear-gradient(90deg, #8b7355 0%, #6b5344 100%);
  border-radius: 2px 0 0 2px;
}

.book-stamp {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 24px;
  height: 24px;
  border: 2px solid #c25550;
  border-radius: 50%;
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.book-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.book-author {
  font-size: 14px;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.book-desc {
  font-size: 12px;
  color: var(--color-secondary);
  flex: 1;
  line-height: 1.5;
}

.book-tags {
  display: flex;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
}

.tag {
  font-size: 10px;
  padding: 2px 8px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 10px;
}

.book-card-link {
  text-decoration: none;
  color: inherit;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--spacing-xxl);
  color: var(--color-secondary);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.page-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-btn:hover:not(:disabled) {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: var(--color-secondary);
  padding: 0 var(--spacing-md);
}

@media (max-width: 768px) {
  .library-container {
    flex-direction: column;
  }
  
  .sidebar {
    position: relative;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    top: 0;
    overflow-y: visible;
  }
  
  .content-area {
    margin-left: 0;
    padding: var(--spacing-md);
  }
  
  .header-tabs {
    margin-left: var(--spacing-md);
  }
  
  .books-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
}
</style>
