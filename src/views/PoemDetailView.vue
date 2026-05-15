<template>
  <div class="poem-detail-view">
    <Breadcrumb :items="breadcrumbItems" />
    
    <div class="page-content" v-if="poem">
      <div class="container">
        <article class="poem-article">
          <header class="poem-header">
            <div class="header-image">
              <div class="book-cover">
                <div class="book-spine"></div>
                <div class="book-stamp"></div>
              </div>
            </div>
            <div class="header-info">
              <h1 class="poem-title">{{ poem.title }}</h1>
              <div class="poem-meta">
                <span class="meta-item">{{ poem.author }}</span>
                <span class="meta-separator">·</span>
                <span class="meta-item">{{ poem.dynasty }}</span>
                <span class="meta-separator">·</span>
                <span class="meta-item">{{ poem.category }}</span>
              </div>
              <div class="poem-famous">
                <span class="famous-label">名句</span>
                <p class="famous-lines">"{{ poem.famousLines }}"</p>
              </div>
            </div>
          </header>

          <section class="article-section full-text">
            <h2 class="section-title">原文</h2>
            <div class="poem-content">
              <pre class="poem-text">{{ poem.fullText }}</pre>
            </div>
          </section>

          <section class="article-section">
            <h2 class="section-title">创作背景</h2>
            <p class="section-content">{{ poem.background }}</p>
          </section>

          <section class="article-section">
            <h2 class="section-title">注释赏析</h2>
            <p class="section-content">{{ poem.annotations }}</p>
          </section>
        </article>
      </div>
    </div>
    
    <div class="not-found" v-else>
      <p>作品不存在</p>
      <router-link to="/library" class="back-link">返回书库</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePoemsStore } from '../stores/poems.js'
import Breadcrumb from '../components/common/Breadcrumb.vue'

const route = useRoute()
const poemsStore = usePoemsStore()

const poem = computed(() => poemsStore.getPoemById(route.params.id))

const breadcrumbItems = computed(() => {
  const category = route.query.category || poem.value?.category || '诗词'
  const categoryPath = route.query.category ? '/library' : '/poems'
  return [
    { name: category, path: categoryPath },
    { name: poem.value?.title || '详情' }
  ]
})
</script>

<style scoped>
.poem-detail-view {
  padding-top: var(--header-height);
}

.poem-header {
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

.poem-title {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.poem-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 16px;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-lg);
}

.meta-separator {
  opacity: 0.5;
}

.poem-famous {
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-accent);
}

.famous-label {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--spacing-sm);
}

.famous-lines {
  font-family: var(--font-classical);
  font-size: 20px;
  line-height: 1.8;
  color: var(--color-primary);
  font-style: italic;
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

.poem-content {
  padding: var(--spacing-xl);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.poem-text {
  font-family: var(--font-classical);
  font-size: 20px;
  line-height: 2;
  color: var(--color-primary);
  white-space: pre-wrap;
  text-align: center;
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

@media (max-width: 1024px) {
  .poem-title {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .poem-title {
    font-size: 28px;
  }

  .famous-lines {
    font-size: 16px;
  }

  .poem-text {
    font-size: 16px;
    line-height: 1.8;
  }
}
</style>
