<template>
  <div class="work-detail-view">
    <Breadcrumb :items="breadcrumbItems" />
    
    <div class="page-content" v-if="work">
      <div class="container">
        <article class="work-article">
          <header class="article-header">
            <div class="header-image">
              <div class="book-cover">
                <div class="book-spine"></div>
                <div class="book-stamp"></div>
              </div>
            </div>
            <div class="header-info">
              <div class="work-category" v-if="work.subcategory">
                {{ work.subcategory }}
              </div>
              <h1 class="work-title">{{ work.title }}</h1>
              <div class="work-meta">
                <span class="meta-item">{{ work.author }}</span>
                <span class="meta-separator">·</span>
                <span class="meta-item">{{ work.dynasty }}</span>
                <span class="meta-separator">·</span>
                <span class="meta-item">{{ work.category }}</span>
              </div>
              <p class="work-summary">{{ work.summary }}</p>
              <div class="work-themes">
                <span class="theme-tag" v-for="theme in work.themes" :key="theme">
                  {{ theme }}
                </span>
              </div>
            </div>
          </header>

          <section class="article-section">
            <h2 class="section-title">作者简介</h2>
            <p class="section-content">{{ work.authorDesc }}</p>
          </section>

          <section class="article-section">
            <h2 class="section-title">创作背景</h2>
            <p class="section-content">{{ work.background }}</p>
          </section>

          <section class="article-section">
            <h2 class="section-title">文学价值</h2>
            <p class="section-content">{{ work.literaryValue }}</p>
          </section>

          <nav class="article-nav">
            <router-link 
              v-if="prevWork" 
              :to="`/works/${prevWork.id}.html`" 
              class="nav-item prev"
            >
              <span class="nav-icon">←</span>
              <div class="nav-info">
                <span class="nav-label">上一篇</span>
                <span class="nav-title">{{ prevWork.title }}</span>
              </div>
            </router-link>
            <div v-else class="nav-item empty"></div>
            
            <router-link 
              v-if="nextWork" 
              :to="`/works/${nextWork.id}.html`" 
              class="nav-item next"
            >
              <div class="nav-info">
                <span class="nav-label">下一篇</span>
                <span class="nav-title">{{ nextWork.title }}</span>
              </div>
              <span class="nav-icon">→</span>
            </router-link>
          </nav>
        </article>
      </div>
    </div>
    
    <div class="not-found" v-else>
      <p>作品不存在</p>
      <router-link to="/library.html" class="back-link">返回书库</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWorksStore } from '../stores/works.js'
import Breadcrumb from '../components/common/Breadcrumb.vue'

const route = useRoute()
const worksStore = useWorksStore()

const work = computed(() => worksStore.getWorkById(route.params.id))

const prevWork = computed(() => {
  if (!route.params.id) return null
  return worksStore.getPrevWork(route.params.id)
})

const nextWork = computed(() => {
  if (!route.params.id) return null
  return worksStore.getNextWork(route.params.id)
})

const breadcrumbItems = computed(() => {
  const category = route.query.category || work.value?.category || '作品'
  return [
    { name: category, path: '/library.html' },
    { name: work.value?.title || '详情' }
  ]
})

const updateTitle = () => {
  if (work.value) {
    document.title = `${work.value.title} - 新文艺`
  } else {
    document.title = '作品详情 - 新文艺'
  }
}

watch(work, () => {
  updateTitle()
}, { immediate: true })

onMounted(() => {
  updateTitle()
})
</script>

<style scoped>
.work-detail-view {
  padding-top: var(--header-height);
}

.article-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--spacing-sm);
  padding: var(--spacing-xxl) 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-xxl);
}

.header-image {
  width: 200px;
  height: 260px;
}

.book-cover {
  width: 200px;
  height: 260px;
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
  width: 14px;
  background: linear-gradient(90deg, #8b7355 0%, #6b5344 100%);
  border-radius: 2px 0 0 2px;
}

.book-stamp {
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 40px;
  height: 40px;
  border: 2px solid #c25550;
  border-radius: 50%;
}

.header-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.work-category {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-accent);
  color: white;
  font-size: 12px;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-md);
  width: fit-content;
}

.work-title {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.work-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 15px;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-lg);
}

.meta-separator {
  opacity: 0.5;
}

.work-summary {
  font-size: 16px;
  line-height: 1.8;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

.work-themes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.theme-tag {
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-bg-secondary);
  color: var(--color-accent);
  font-size: 14px;
  border-radius: var(--radius-sm);
}

.article-section {
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

.article-nav {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-xl);
  padding: var(--spacing-xxl) 0;
  border-top: 1px solid var(--color-border);
  margin-top: var(--spacing-xxl);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 45%;
}

.nav-item.empty {
  background: transparent;
}

.nav-item.prev {
  justify-content: flex-start;
}

.nav-item.next {
  justify-content: flex-end;
  text-align: right;
}

.nav-item:hover {
  background: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(201, 169, 110, 0.3);
}

.nav-item:hover .nav-label,
.nav-item:hover .nav-title,
.nav-item:hover .nav-icon {
  color: white;
}

.nav-icon {
  font-size: 24px;
  color: var(--color-accent);
  transition: color 0.3s ease;
}

.nav-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.nav-label {
  font-size: 12px;
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.nav-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  transition: color 0.3s ease;
}

@media (max-width: 768px) {
  .article-header {
    grid-template-columns: 250px 1fr;
  }

  .header-image {
    width: 250px;
    height: 330px;
  }

  .work-title {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .article-header {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }

  .header-image {
    width: 120px;
    height: 160px;
    margin: 0 auto;
  }

  .work-title {
    font-size: 28px;
    text-align: center;
  }

  .work-meta {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
