<template>
  <div class="author-detail-view">
    <Breadcrumb :items="breadcrumbItems" />
    
    <div class="page-content" v-if="author">
      <div class="container">
        <header class="author-header">
          <div class="author-avatar">{{ author.name.charAt(0) }}</div>
          <div class="author-info">
            <h1 class="author-name">{{ author.name }}</h1>
            <p class="author-dynasty">{{ author.dynasty }}</p>
            <p class="author-bio" v-if="author.bio">{{ author.bio }}</p>
          </div>
        </header>

        <section class="author-section" v-if="author.authorDesc">
          <h2 class="section-title">作者简介</h2>
          <p class="section-content">{{ author.authorDesc }}</p>
        </section>

        <section class="author-section" v-if="author.works.length">
          <h2 class="section-title">代表作品</h2>
          <div class="works-grid">
            <router-link 
              v-for="work in author.works" 
              :key="work.id"
              :to="work.link"
              class="work-card"
            >
              <div class="work-image">
                <div class="book-cover">
                  <div class="book-spine"></div>
                  <div class="book-stamp"></div>
                </div>
              </div>
              <div class="work-info">
                <h3 class="work-title">{{ work.title }}</h3>
                <p class="work-category">{{ work.category }}</p>
                <p class="work-summary">{{ work.summary }}</p>
              </div>
            </router-link>
          </div>
        </section>
      </div>
    </div>

    <div class="not-found" v-else>
      <p>作者不存在</p>
      <router-link to="/authors.html" class="back-link">返回作者列表</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useClassicsStore } from '../stores/classics.js'
import { usePoemsStore } from '../stores/poems.js'
import { useWorksStore } from '../stores/works.js'
import Breadcrumb from '../components/common/Breadcrumb.vue'

const route = useRoute()
const classicsStore = useClassicsStore()
const poemsStore = usePoemsStore()
const worksStore = useWorksStore()

const author = computed(() => {
  const authorName = decodeURIComponent(route.params.name)
  const authorWorks = []
  let authorInfo = null

  classicsStore.classicsList.forEach(item => {
    if (item.author === authorName) {
      if (!authorInfo) {
        authorInfo = {
          name: item.author,
          dynasty: item.dynasty,
          authorDesc: item.authorDesc || ''
        }
      }
      authorWorks.push({
        id: item.id,
        title: item.title,
        category: item.category,
        coverImage: item.coverImage,
        summary: item.summary,
        link: `/classics/${item.id}.html`
      })
    }
  })

  poemsStore.poemsList.forEach(item => {
    if (item.author === authorName) {
      if (!authorInfo) {
        authorInfo = {
          name: item.author,
          dynasty: item.dynasty,
          authorDesc: ''
        }
      }
      authorWorks.push({
        id: item.id,
        title: item.title,
        category: item.category,
        coverImage: item.coverImage,
        summary: item.famousLines || '',
        link: `/poems/${item.id}.html`
      })
    }
  })

  worksStore.worksList.forEach(item => {
    if (item.author === authorName) {
      if (!authorInfo) {
        authorInfo = {
          name: item.author,
          dynasty: item.dynasty,
          authorDesc: ''
        }
      }
      authorWorks.push({
        id: item.id,
        title: item.title,
        category: item.category,
        coverImage: item.coverImage,
        summary: item.summary || '',
        link: `/works/${item.id}.html`
      })
    }
  })

  if (!authorInfo) return null

  return {
    ...authorInfo,
    works: authorWorks
  }
})

const breadcrumbItems = computed(() => [
  { name: '作者', path: '/authors.html' },
  { name: author.value?.name || '详情' }
])

const updateTitle = () => {
  if (author.value) {
    document.title = `${author.value.name}人物介绍 - 新文艺`
  } else {
    document.title = '作者详情 - 新文艺'
  }
}

watch(author, () => {
  updateTitle()
}, { immediate: true })

onMounted(() => {
  updateTitle()
})
</script>

<style scoped>
.author-detail-view {
  padding-top: var(--header-height);
  min-height: 100vh;
  background: var(--color-bg-primary);
}

.author-header {
  display: flex;
  gap: var(--spacing-xxl);
  padding: var(--spacing-xxl) 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-xxl);
}

.author-avatar {
  width: 120px;
  height: 120px;
  min-width: 120px;
  background: linear-gradient(135deg, var(--color-accent) 0%, #d4a855 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 600;
  color: white;
  font-family: var(--font-display);
}

.author-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.author-name {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.author-dynasty {
  font-size: 18px;
  color: var(--color-accent);
  margin-bottom: var(--spacing-md);
}

.author-bio {
  font-size: 16px;
  line-height: 1.8;
  color: var(--color-secondary);
}

.author-section {
  margin-bottom: var(--spacing-xxl);
}

.section-title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-accent);
}

.section-content {
  font-size: 16px;
  line-height: 1.9;
  color: var(--color-primary);
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);
}

.work-card {
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

.work-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.work-image {
  width: 100px;
  height: 130px;
  min-width: 100px;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.book-cover {
  width: 100%;
  height: 100%;
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
  width: 7px;
  background: linear-gradient(90deg, #8b7355 0%, #6b5344 100%);
  border-radius: 2px 0 0 2px;
}

.book-stamp {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 20px;
  height: 20px;
  border: 2px solid #c25550;
  border-radius: 50%;
}

.work-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.work-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.work-category {
  font-size: 12px;
  color: var(--color-accent);
  margin-bottom: var(--spacing-sm);
}

.work-summary {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.not-found {
  text-align: center;
  padding: var(--spacing-xxl);
}

.not-found p {
  font-size: 18px;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-md);
}

.back-link {
  color: var(--color-accent);
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .author-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .author-name {
    font-size: 32px;
  }

  .works-grid {
    grid-template-columns: 1fr;
  }

  .work-card {
    flex-direction: column;
    align-items: center;
  }
}
</style>
