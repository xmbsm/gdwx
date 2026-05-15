<template>
  <div class="home-view">
    <HeroSection />

    <section class="poems-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">经典诗词</h2>
          <p class="section-desc">唐诗宋词，千年传颂</p>
          <router-link to="/poems.html" class="section-more">
            查看全部 <span>→</span>
          </router-link>
        </div>
        <div class="poems-grid">
          <PoemCard 
            v-for="poem in poemsData" 
            :key="poem.id" 
            :poem="poem"
          />
        </div>
      </div>
    </section>

    <section class="classics-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">名著</h2>
          <p class="section-desc">中国古典小说的巅峰之作</p>
          <router-link to="/library.html" class="section-more">
            查看全部 <span>→</span>
          </router-link>
        </div>
        <div class="classics-grid">
          <BookCard 
            v-for="book in classicsData" 
            :key="book.id" 
            :book="book"
            type="classics"
          />
        </div>
      </div>
    </section>

    <section class="categories-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">分类浏览</h2>
          <p class="section-desc">按类别探索古典文学</p>
        </div>
        <div class="categories-grid">
          <router-link to="/library.html?category=诸子百家" class="category-card">
            <div class="category-icon">📜</div>
            <h3 class="category-name">诸子百家</h3>
            <p class="category-count">先秦哲学经典</p>
          </router-link>
          <router-link to="/library.html?category=史部" class="category-card">
            <div class="category-icon">📚</div>
            <h3 class="category-name">史部</h3>
            <p class="category-count">历代史书典籍</p>
          </router-link>
          <router-link to="/library.html?category=诗文" class="category-card">
            <div class="category-icon">✍️</div>
            <h3 class="category-name">诗文</h3>
            <p class="category-count">诗词文赋佳作</p>
          </router-link>
          <router-link to="/library.html?category=笔记" class="category-card">
            <div class="category-icon">📝</div>
            <h3 class="category-name">笔记小说</h3>
            <p class="category-count">志人志怪小说</p>
          </router-link>
          <router-link to="/library.html?category=词曲" class="category-card">
            <div class="category-icon">🎵</div>
            <h3 class="category-name">词曲</h3>
            <p class="category-count">宋词元曲精选</p>
          </router-link>
          <router-link to="/library.html?category=戏曲" class="category-card">
            <div class="category-icon">🎭</div>
            <h3 class="category-name">戏曲</h3>
            <p class="category-count">古典戏曲剧本</p>
          </router-link>
          <router-link to="/authors.html" class="category-card">
            <div class="category-icon">👤</div>
            <h3 class="category-name">作者</h3>
            <p class="category-count">名家作者介绍</p>
          </router-link>
          <router-link to="/library.html?category=短篇佳作" class="category-card">
            <div class="category-icon">✨</div>
            <h3 class="category-name">短篇佳作</h3>
            <p class="category-count">三言二拍精选</p>
          </router-link>
        </div>
      </div>
    </section>

    <section class="about-section">
      <div class="section-container">
        <div class="about-content">
          <h2 class="about-title">关于本站</h2>
          <p class="about-desc">
            新文艺致力于发现生活中美好的文学艺术，收录诗歌、名著、散文等经典文学作品。
            所有内容均来自公有领域，无版权争议，旨在为文学爱好者、在校学生和文史研究者提供便捷的阅读平台。
          </p>
          <router-link to="/about.html" class="about-link">
            了解更多 →
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useClassicsStore } from '../stores/classics.js'
import { usePoemsStore } from '../stores/poems.js'
import HeroSection from '../components/HeroSection.vue'
import BookCard from '../components/content/BookCard.vue'
import PoemCard from '../components/content/PoemCard.vue'

const classicsStore = useClassicsStore()
const poemsStore = usePoemsStore()

const classicsData = computed(() => classicsStore.classicsList.slice(0, 4))
const poemsData = computed(() => poemsStore.poemsList.slice(0, 4))
</script>

<style scoped>
.home-view {
  overflow-x: hidden;
}

.section-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.section-header {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 600;
  color: var(--color-primary);
}

.section-desc {
  font-size: 16px;
  color: var(--color-secondary);
  flex: 1;
}

.section-more {
  font-size: 14px;
  color: var(--color-accent);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  transition: gap var(--transition-fast);
}

.section-more:hover {
  gap: var(--spacing-sm);
}

.classics-section {
  padding: 100px 0;
  background: #fdf8f0;
}

.poems-section {
  padding: 100px 0;
  background: var(--color-bg-secondary);
}

.classics-grid,
.poems-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.categories-section {
  padding: var(--spacing-xxl) 0;
  background: var(--color-bg-secondary);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
}

.category-card {
  background: white;
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
  text-align: center;
  text-decoration: none;
  transition: all var(--transition-normal);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.category-icon {
  font-size: 36px;
  margin-bottom: var(--spacing-md);
}

.category-name {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.category-count {
  font-size: 13px;
  color: var(--color-secondary);
}

.about-section {
  padding: var(--spacing-xxl) 0;
  background: var(--color-bg-primary);
}

.about-content {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.about-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

.about-desc {
  font-size: 15px;
  line-height: 2;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-lg);
}

.about-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-accent);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all var(--transition-normal);
}

.about-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(201, 169, 110, 0.3);
}

@media (max-width: 1024px) {
  .classics-grid,
  .poems-grid,
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .section-container {
    padding: 0 var(--spacing-md);
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .section-title {
    font-size: 24px;
  }

  .classics-section,
  .poems-section {
    padding: 60px 0;
  }

  .categories-section {
    padding: 60px 0;
  }

  .classics-grid,
  .poems-grid,
  .categories-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .about-section {
    padding: var(--spacing-xl) 0;
  }

  .about-title {
    font-size: 24px;
  }
}
</style>
