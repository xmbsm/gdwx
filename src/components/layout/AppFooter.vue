<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">关于本站</h3>
          <p class="footer-desc">
            新文艺致力于发现生活中美好的文学艺术，<br />
            收录诗歌、名著、散文等经典文学作品。
          </p>
        </div>
        
        <div class="footer-section">
          <h3 class="footer-title">内容分类</h3>
          <ul class="footer-links">
            <li><router-link to="/library.html">书库</router-link></li>
            <li><router-link to="/poems.html">诗词</router-link></li>
            <li><router-link to="/authors.html">作者</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3 class="footer-title">相关链接</h3>
          <ul class="footer-links">
            <li><a href="https://github.com/xmbsm/gdwx" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><router-link to="/about.html">关于我们</router-link></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-divider"></div>
        <p class="copyright">
          © 2026 新文艺 · 仅供学习交流使用
        </p>
        <p class="copyright-note">
          所有内容均来自公有领域作品，无版权侵权内容
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: var(--color-bg-dark);
  color: var(--color-bg-secondary);
  padding: var(--spacing-xxl) 0 var(--spacing-xl);
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--spacing-xxl);
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--color-accent);
  margin-bottom: var(--spacing-md);
  font-weight: 500;
}

.footer-desc {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(245, 240, 232, 0.8);
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.footer-links a {
  color: rgba(245, 240, 232, 0.8);
  text-decoration: none;
  font-size: 14px;
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--color-accent);
}

.footer-bottom {
  margin-top: var(--spacing-xxl);
}

.footer-divider {
  height: 1px;
  background: rgba(245, 240, 232, 0.1);
  margin-bottom: var(--spacing-lg);
}

.copyright {
  font-size: 14px;
  color: rgba(245, 240, 232, 0.6);
  text-align: center;
  margin-bottom: var(--spacing-xs);
}

.copyright-note {
  font-size: 12px;
  color: rgba(245, 240, 232, 0.4);
  text-align: center;
}

@media (max-width: 768px) {
  .app-footer {
    padding: var(--spacing-xl) 0;
  }

  .footer-container {
    padding: 0 var(--spacing-md);
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
    text-align: center;
  }

  .footer-section {
    align-items: center;
  }

  .footer-links {
    align-items: center;
  }
}
</style>
