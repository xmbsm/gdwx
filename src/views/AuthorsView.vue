<template>
  <div class="authors-view">
    <div class="page-content">
      <div class="container">
        <header class="page-header">
          <h1 class="page-title">作者</h1>
          <p class="page-desc">领略古典文学大家的创作风采</p>
        </header>

        <div class="filters-bar">
          <div class="filter-group">
            <span class="filter-label">朝代筛选：</span>
            <button 
              class="filter-btn"
              :class="{ active: selectedDynasty === '全部' }"
              @click="selectedDynasty = '全部'"
            >
              全部
            </button>
            <button 
              v-for="dynasty in dynasties" 
              :key="dynasty"
              class="filter-btn"
              :class="{ active: selectedDynasty === dynasty }"
              @click="selectedDynasty = dynasty"
            >
              {{ dynasty }}
            </button>
          </div>
          
          <div class="sort-group">
            <span class="filter-label">排序：</span>
            <button 
              class="sort-btn"
              :class="{ active: sortBy === 'name' }"
              @click="sortBy = 'name'"
            >
              按姓名
            </button>
            <button 
              class="sort-btn"
              :class="{ active: sortBy === 'letter' }"
              @click="sortBy = 'letter'"
            >
              按字母
            </button>
          </div>
        </div>

        <div class="authors-grid" v-if="paginatedAuthors.length">
          <router-link 
            v-for="author in paginatedAuthors" 
            :key="author.name"
            :to="`/authors/${encodeURIComponent(author.name)}.html`"
            class="author-card"
          >
            <div class="author-avatar">{{ author.name.charAt(0) }}</div>
            <div class="author-info">
              <h3 class="author-name">{{ author.name }}</h3>
              <p class="author-dynasty">{{ author.dynasty }}</p>
              <p class="author-desc">{{ author.desc }}</p>
              <div class="author-works">
                <span 
                  v-for="work in author.works.slice(0, 3)" 
                  :key="work.id"
                  class="work-tag"
                >
                  {{ work.title }}
                </span>
                <span v-if="author.works.length > 3" class="work-tag more">
                  +{{ author.works.length - 3 }}
                </span>
              </div>
            </div>
          </router-link>
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

        <div class="empty-state" v-if="filteredAuthors.length === 0">
          <p>暂无该朝代的作者</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useClassicsStore } from '../stores/classics.js'
import { usePoemsStore } from '../stores/poems.js'
import { useWorksStore } from '../stores/works.js'

const classicsStore = useClassicsStore()
const poemsStore = usePoemsStore()
const worksStore = useWorksStore()

const selectedDynasty = ref('全部')
const sortBy = ref('name')
const currentPage = ref(1)
const pageSize = 20

const allAuthors = computed(() => {
  const authorMap = new Map()
  
  classicsStore.classicsList.forEach(item => {
    if (!authorMap.has(item.author)) {
      authorMap.set(item.author, {
        name: item.author,
        dynasty: item.dynasty,
        desc: item.authorDesc?.substring(0, 100) + '...' || '',
        works: []
      })
    }
    authorMap.get(item.author).works.push({
      id: item.id,
      title: item.title,
      link: `/classics/${item.id}`
    })
  })
  
  poemsStore.poemsList.forEach(item => {
    if (!authorMap.has(item.author)) {
      authorMap.set(item.author, {
        name: item.author,
        dynasty: item.dynasty,
        desc: '',
        works: []
      })
    }
    authorMap.get(item.author).works.push({
      id: item.id,
      title: item.title,
      link: `/poems/${item.id}`
    })
  })
  
  worksStore.worksList.forEach(item => {
    if (!authorMap.has(item.author)) {
      authorMap.set(item.author, {
        name: item.author,
        dynasty: item.dynasty,
        desc: '',
        works: []
      })
    }
    authorMap.get(item.author).works.push({
      id: item.id,
      title: item.title,
      link: `/works/${item.id}`
    })
  })
  
  return Array.from(authorMap.values())
})

const dynasties = computed(() => {
  const dynastySet = new Set()
  allAuthors.value.forEach(author => {
    dynastySet.add(author.dynasty)
  })
  return Array.from(dynastySet).sort()
})

const filteredAuthors = computed(() => {
  let result = [...allAuthors.value]
  
  if (selectedDynasty.value !== '全部') {
    result = result.filter(author => author.dynasty === selectedDynasty.value)
  }
  
  if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
  } else if (sortBy.value === 'letter') {
    result.sort((a, b) => {
      const pinyinA = getFirstLetter(a.name)
      const pinyinB = getFirstLetter(b.name)
      return pinyinA.localeCompare(pinyinB, 'en-US')
    })
  }
  
  return result
})

const totalPages = computed(() => Math.ceil(filteredAuthors.value.length / pageSize))

const paginatedAuthors = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredAuthors.value.slice(start, end)
})

watch([selectedDynasty, sortBy], () => {
  currentPage.value = 1
})

function getFirstLetter(name) {
  const pinyinMap = {
    '曹': 'C', '罗': 'L', '施': 'S', '吴': 'W',
    '张': 'Z', '苏': 'S', '杜': 'D', '李': 'L',
    '王': 'W', '白': 'B', '辛': 'X', '陆': 'L'
  }
  return pinyinMap[name.charAt(0)] || name.charAt(0).toUpperCase()
}
</script>

<style scoped>
.authors-view {
  padding-top: var(--header-height);
  min-height: 100vh;
  background: var(--color-bg-primary);
}

.page-header {
  text-align: center;
  padding: var(--spacing-xxl) 0;
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

.filters-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: white;
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.filter-group,
.sort-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.filter-label {
  font-size: 14px;
  color: var(--color-secondary);
  font-weight: 500;
}

.filter-btn,
.sort-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn:hover,
.sort-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.filter-btn.active,
.sort-btn.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.authors-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-xl);
  padding-bottom: var(--spacing-xxl);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xxl);
}

.empty-state p {
  font-size: 16px;
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

.author-card {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  text-decoration: none;
  color: inherit;
}

.author-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.author-avatar {
  width: 64px;
  height: 64px;
  min-width: 64px;
  background: linear-gradient(135deg, var(--color-accent) 0%, #d4a855 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  color: white;
  font-family: var(--font-display);
}

.author-info {
  flex: 1;
}

.author-name {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.author-dynasty {
  font-size: 14px;
  color: var(--color-accent);
  margin-bottom: var(--spacing-sm);
}

.author-desc {
  font-size: 14px;
  color: var(--color-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.author-works {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.work-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-bg-secondary);
  color: var(--color-primary);
  font-size: 12px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.work-tag:hover {
  background: var(--color-accent);
  color: white;
}

@media (max-width: 1440px) {
  .authors-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .authors-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .authors-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .author-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .author-works {
    justify-content: center;
  }
}
</style>
