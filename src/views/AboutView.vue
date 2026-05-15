<template>
  <div class="about-view">
    <div class="page-content">
      <div class="container">
        <article class="about-article">
          <header class="article-header">
            <h1 class="about-title">关于本站</h1>
            <p class="about-subtitle">发现生活中美好的文学艺术</p>
          </header>

          <section class="about-section">
            <h2 class="section-title">网站简介</h2>
            <p class="section-content">
              新文艺是一个专注于文学艺术的内容展示与阅读平台。
              我们致力于发现生活中美好的事物，收录诗歌、名著、散文等经典文学作品。
            </p>
            <p class="section-content">
              网站采用纯前端静态架构设计，无需后端服务，所有内容静态渲染，依托CDN加速技术，
              为用户提供快速、稳定的访问体验。
            </p>
          </section>

          <section class="about-section">
            <h2 class="section-title">内容分类</h2>
            <div class="category-list">
              <div class="category-item">
                <h3>名著</h3>
                <p>《红楼梦》《三国演义》《水浒传》《西游记》中国古典小说的巅峰之作</p>
              </div>
              <div class="category-item">
                <h3>诗词</h3>
                <p>唐诗、宋词、元曲代表作品，千年传颂的经典名篇</p>
              </div>
              <div class="category-item">
                <h3>晚清谴责小说</h3>
                <p>《官场现形记》《二十年目睹之怪现状》《老残游记》《孽海花》</p>
              </div>
              <div class="category-item">
                <h3>神魔志怪小说</h3>
                <p>《封神演义》《聊斋志异》等充满想象力的志怪佳作</p>
              </div>
              <div class="category-item">
                <h3>公案侠义小说</h3>
                <p>《包公案》《三侠五义》等展现侠义精神的作品</p>
              </div>
              <div class="category-item">
                <h3>白话短篇小说</h3>
                <p>"三言二拍"等明代白话短篇小说的代表作品</p>
              </div>
            </div>
          </section>

          <section class="about-section">
            <h2 class="section-title">使用说明</h2>
            <div class="guide-list">
              <div class="guide-item">
                <span class="guide-icon">🔍</span>
                <div class="guide-content">
                  <h3>搜索功能</h3>
                  <p>您可以通过顶部的搜索框搜索作品名称、作者姓名、诗词名句或内容关键词。</p>
                </div>
              </div>
              <div class="guide-item">
                <span class="guide-icon">📚</span>
                <div class="guide-content">
                  <h3>分类浏览</h3>
                  <p>点击导航栏中的分类链接，可以浏览对应类别的所有作品。</p>
                </div>
              </div>
              <div class="guide-item">
                <span class="guide-icon">↑</span>
                <div class="guide-content">
                  <h3>返回顶部</h3>
                  <p>浏览长页面时，点击右下角的返回顶部按钮可以快速回到页面顶部。</p>
                </div>
              </div>
            </div>
          </section>

          <section class="about-section">
            <h2 class="section-title">版权声明</h2>
            <p class="section-content">
              本站点仅展示公有领域古典文学作品，所有内容均来自历史传承的经典文献，无现代版权争议。
              所有内容仅用于传统文化学习与传播，不用于商业盈利目的。
            </p>
            <p class="section-content">
              如有任何内容侵犯了您的权益，请联系我们，我们将在第一时间进行处理。
            </p>
          </section>

          <section class="about-section">
            <h2 class="section-title">联系方式</h2>
            <p class="section-content">
              如您对本站有任何建议或意见，欢迎提出。您可以通过以下方式联系我们。
            </p>
            <div class="contact-list">
              <div class="contact-item">
                <span class="contact-icon">📧</span>
                <span>1@xinwenyi.com</span>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about-view {
  padding-top: var(--header-height);
  min-height: 100vh;
}

.about-article {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xxl) 0;
}

.article-header {
  text-align: center;
  margin-bottom: var(--spacing-xxl);
}

.about-title {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.about-subtitle {
  font-size: 18px;
  color: var(--color-secondary);
}

.about-section {
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
  margin-bottom: var(--spacing-md);
}

.category-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.category-item {
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.category-item h3 {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-accent);
  margin-bottom: var(--spacing-sm);
}

.category-item p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-primary);
}

.guide-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.guide-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.guide-icon {
  font-size: 32px;
  line-height: 1;
}

.guide-content h3 {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.guide-content p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-secondary);
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-primary);
}

.contact-icon {
  font-size: 18px;
}

@media (max-width: 768px) {
  .about-title {
    font-size: 36px;
  }

  .category-list {
    grid-template-columns: 1fr;
  }
}
</style>
