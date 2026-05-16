<template>
  <div class="classic-detail-view">
    <Breadcrumb :items="breadcrumbItems" />
    
    <div class="page-content" v-if="classic">
      <div class="container">
        <article class="classic-article">
          <header class="article-header">
            <div class="header-image">
              <div class="book-cover">
                <div class="book-spine"></div>
                <div class="book-stamp"></div>
              </div>
            </div>
            <div class="header-info">
              <h1 class="classic-title">{{ classic.title }}</h1>
              <div class="classic-meta">
                <span class="meta-item">
                  <span class="meta-icon">👤</span>
                  <span>{{ classic.author }}</span>
                </span>
                <span class="meta-item">
                  <span class="meta-icon">📅</span>
                  <span>{{ classic.dynasty }}</span>
                </span>
                <span class="meta-item">
                  <span class="meta-icon">📚</span>
                  <span>{{ classic.category }}</span>
                </span>
              </div>
              <p class="classic-summary">{{ classic.summary }}</p>
              <div class="classic-themes">
                <span class="theme-tag" v-for="theme in classic.themes" :key="theme">
                  {{ theme }}
                </span>
              </div>
            </div>
          </header>

          <section class="article-section">
            <h2 class="section-title">作者简介</h2>
            <p class="section-content">{{ classic.authorDesc }}</p>
          </section>

          <section class="article-section">
            <h2 class="section-title">创作背景</h2>
            <p class="section-content">{{ classic.background }}</p>
          </section>

          <section class="article-section">
            <h2 class="section-title">文学价值</h2>
            <p class="section-content">{{ classic.literaryValue }}</p>
          </section>

          <section class="article-section">
            <h2 class="section-title">主要人物</h2>
            <div class="characters-grid">
              <div class="character-card" v-for="char in classic.characters" :key="char.name">
                <h3 class="character-name">{{ char.name }}</h3>
                <p class="character-desc">{{ char.desc }}</p>
              </div>
            </div>
          </section>

          <section class="article-section">
            <h2 class="section-title">回目概览</h2>
            <div class="chapters-list">
              <div class="chapter-item" v-for="chapter in classic.chapters" :key="chapter.num">
                <span class="chapter-num">第{{ chapter.num }}回</span>
                <span class="chapter-title">{{ chapter.title }}</span>
              </div>
              <div class="chapters-more">
                <span>更多回目内容整理中...</span>
              </div>
            </div>
          </section>

          <nav class="article-nav">
            <router-link 
              v-if="prevClassic" 
              :to="`/classics/${prevClassic.id}.html`" 
              class="nav-item prev"
            >
              <span class="nav-icon">←</span>
              <div class="nav-info">
                <span class="nav-label">上一篇</span>
                <span class="nav-title">{{ prevClassic.title }}</span>
              </div>
            </router-link>
            <div v-else class="nav-item empty"></div>
            
            <router-link 
              v-if="nextClassic" 
              :to="`/classics/${nextClassic.id}.html`" 
              class="nav-item next"
            >
              <div class="nav-info">
                <span class="nav-label">下一篇</span>
                <span class="nav-title">{{ nextClassic.title }}</span>
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
import { useClassicsStore } from '../stores/classics.js'
import Breadcrumb from '../components/common/Breadcrumb.vue'

const route = useRoute()
const classicsStore = useClassicsStore()

const classic = computed(() => classicsStore.getClassicById(route.params.id))

const prevClassic = computed(() => {
  if (!route.params.id) return null
  return classicsStore.getPrevClassic(route.params.id)
})

const nextClassic = computed(() => {
  if (!route.params.id) return null
  return classicsStore.getNextClassic(route.params.id)
})

const breadcrumbItems = computed(() => {
  const category = route.query.category || classic.value?.category || '作品'
  return [
    { name: category, path: '/library.html' },
    { name: classic.value?.title || '详情' }
  ]
})

const updateTitle = () => {
  if (classic.value) {
    document.title = `${classic.value.title} - 新文艺`
  } else {
    document.title = '作品详情 - 新文艺'
  }
}

watch(classic, () => {
  updateTitle()
}, { immediate: true })

onMounted(() => {
  updateTitle()
})
</script>

<style scoped>
.classic-detail-view {
  padding-top: var(--header-height);
}

.article-header {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 80px;
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

.classic-title {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

.classic-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 15px;
  color: var(--color-secondary);
}

.meta-icon {
  font-size: 14px;
}

.classic-summary {
  font-size: 16px;
  line-height: 1.8;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

.classic-themes {
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

.characters-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.character-card {
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-accent);
}

.character-name {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-accent);
  margin-bottom: var(--spacing-sm);
}

.character-desc {
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-primary);
}

.chapters-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.chapter-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.chapter-item:hover {
  background: var(--color-border);
  transform: translateX(4px);
}

.chapter-num {
  font-weight: 600;
  color: var(--color-accent);
  min-width: 70px;
}

.chapter-title {
  font-size: 15px;
  color: var(--color-primary);
}

.chapters-more {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--color-secondary);
  font-size: 14px;
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

@media (max-width: 1024px) {
  .classic-title {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .classic-title {
    font-size: 28px;
  }

  .characters-grid {
    grid-template-columns: 1fr;
  }

  .chapter-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}
</style>
