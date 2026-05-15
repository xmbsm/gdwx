<template>
  <div class="search-view">
    <div class="page-content">
      <div class="container">
        <header class="search-header">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input 
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="搜索作品、作者、名句..."
              @input="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">搜索</button>
          </div>
        </header>

        <div class="search-results" v-if="searchQuery">
          <div class="results-header">
            <p class="results-count" v-if="results.length">
              找到 <strong>{{ results.length }}</strong> 个相关结果
            </p>
            <p class="results-empty" v-else>
              未找到相关结果
            </p>
          </div>

          <div class="results-list" v-if="results.length">
            <router-link 
              v-for="result in results" 
              :key="result.id"
              :to="getResultLink(result)"
              class="result-item"
            >
              <div class="result-image">
                <div class="book-cover-wrapper">
                  <div class="book-cover">
                    <div class="book-spine"></div>
                    <div class="book-stamp"></div>
                  </div>
                </div>
              </div>
              <div class="result-content">
                <span class="result-type">{{ result.typeName }}</span>
                <h3 class="result-title">{{ result.title }}</h3>
                <p class="result-author">{{ result.author }} · {{ result.dynasty }}</p>
                <p class="result-summary text-ellipsis-2">
                  {{ result.famousLines || result.summary }}
                </p>
              </div>
            </router-link>
          </div>
        </div>

        <div class="search-hint" v-else>
          <div class="hint-icon">📚</div>
          <h3 class="hint-title">搜索提示</h3>
          <p class="hint-desc">输入关键词搜索名著、诗词或其他古典文学作品</p>
          <div class="hint-suggestions">
            <span class="hint-label">热门搜索：</span>
            <button 
              v-for="keyword in suggestions" 
              :key="keyword"
              class="suggestion-btn"
              @click="quickSearch(keyword)"
            >
              {{ keyword }}
            </button>
          </div>
        </div>

        <div class="search-history" v-if="searchHistory.length && !searchQuery">
          <h3 class="history-title">搜索历史</h3>
          <div class="history-list">
            <button 
              v-for="(item, index) in searchHistory" 
              :key="index"
              class="history-item"
              @click="useHistory(item)"
            >
              <span class="history-icon">🕐</span>
              <span class="history-text">{{ item }}</span>
            </button>
          </div>
          <button class="clear-history" @click="clearHistory">清除历史</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSearchStore } from '../stores/search.js'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

const searchQuery = ref('')
const suggestions = ['红楼梦', '三国演义', '唐诗', '宋词', '西游记']

const results = computed(() => searchStore.results)
const searchHistory = computed(() => searchStore.history)

let debounceTimer = null

function handleSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (searchQuery.value.trim()) {
      router.replace({ query: { q: searchQuery.value } })
    }
    searchStore.search(searchQuery.value)
  }, 300)
}

function quickSearch(keyword) {
  searchQuery.value = keyword
  handleSearch()
}

function useHistory(keyword) {
  searchQuery.value = keyword
  handleSearch()
}

function clearHistory() {
  searchStore.clearHistory()
}

function getResultLink(result) {
  const typeMap = {
    classics: 'classics',
    poems: 'poems',
    works: 'works'
  }
  return `/${typeMap[result.type]}/${result.id}.html`
}

onMounted(() => {
  const query = route.query.q
  if (query) {
    searchQuery.value = query
    searchStore.search(query)
  }
})
</script>

<style scoped>
.search-view {
  padding-top: var(--header-height);
  min-height: 100vh;
}

.search-header {
  padding: var(--spacing-xxl) 0;
  background: var(--color-bg-secondary);
  margin-bottom: var(--spacing-xl);
}

.search-input-wrapper {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: white;
  border-radius: 50px;
  box-shadow: var(--shadow-md);
}

.search-icon {
  padding-left: var(--spacing-md);
  font-size: 18px;
  opacity: 0.5;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
  padding: var(--spacing-sm);
}

.search-btn {
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-btn:hover {
  background: #b89a5e;
}

.results-header {
  margin-bottom: var(--spacing-xl);
}

.results-count {
  font-size: 16px;
  color: var(--color-secondary);
}

.results-count strong {
  color: var(--color-accent);
}

.results-empty {
  font-size: 16px;
  color: var(--color-secondary);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.result-item {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-normal);
}

.result-item:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

.result-image {
  flex-shrink: 0;
}

.book-cover-wrapper {
  flex-shrink: 0;
}

.book-cover {
  width: 120px;
  height: 150px;
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
  width: 12px;
  background: linear-gradient(90deg, #8b7355 0%, #6b5344 100%);
  border-radius: 2px 0 0 2px;
}

.book-stamp {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 30px;
  height: 30px;
  border: 2px solid #c25550;
  border-radius: 50%;
}

.result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.result-type {
  display: inline-block;
  width: fit-content;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-secondary);
  color: var(--color-secondary);
  font-size: 12px;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.result-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.result-author {
  font-size: 14px;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-sm);
}

.result-summary {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-primary);
}

.search-hint {
  text-align: center;
  padding: var(--spacing-xxl);
}

.hint-icon {
  font-size: 64px;
  margin-bottom: var(--spacing-lg);
}

.hint-title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.hint-desc {
  font-size: 16px;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-xl);
}

.hint-suggestions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.hint-label {
  font-size: 14px;
  color: var(--color-secondary);
}

.suggestion-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.suggestion-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.search-history {
  margin-top: var(--spacing-xxl);
}

.history-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

.history-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.history-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.history-item:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.history-icon {
  font-size: 12px;
  opacity: 0.5;
}

.clear-history {
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.clear-history:hover {
  border-color: var(--color-red);
  color: var(--color-red);
}

@media (max-width: 768px) {
  .result-item {
    flex-direction: column;
  }

  .result-image {
    width: 100%;
  }

  .book-cover {
    width: 120px;
    height: 150px;
  }

  .hint-suggestions {
    flex-direction: column;
  }
}
</style>
