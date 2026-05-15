<template>
  <div class="not-found-view">
    <div class="container">
      <div class="content">
        <h1 class="title">404</h1>
        <p class="message">抱歉，您访问的页面不存在</p>
        <router-link to="/" class="home-link">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding-top: var(--header-height);
}

.container {
  text-align: center;
  padding: var(--spacing-xxl);
}

.content {
  max-width: 600px;
  margin: 0 auto;
}

.title {
  font-family: var(--font-display);
  font-size: 120px;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: var(--spacing-lg);
  line-height: 1;
}

.message {
  font-size: 24px;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xxl);
}

.home-link {
  display: inline-block;
  padding: var(--spacing-md) var(--spacing-xxl);
  background: var(--color-accent);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-md);
  font-size: 16px;
  transition: all var(--transition-fast);
}

.home-link:hover {
  background: #b89a5e;
  transform: translateY(-2px);
}
</style>
