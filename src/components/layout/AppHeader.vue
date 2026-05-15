<template>
  <header class="app-header">
    <div class="header-container">
      <router-link to="/" class="logo">
        <img src="/logo.svg" alt="古典文学名著网" class="logo-img" />
      </router-link>
      
      <nav class="nav-menu" :class="{ 'is-active': isMobileMenuOpen }">
        <router-link to="/" class="nav-link" @click="closeMobileMenu">首页</router-link>
        <router-link to="/poems" class="nav-link" @click="closeMobileMenu">诗词</router-link>
        <router-link to="/classics" class="nav-link" @click="closeMobileMenu">名著</router-link>
        <router-link to="/library" class="nav-link" @click="closeMobileMenu">书库</router-link>
        <router-link to="/authors" class="nav-link" @click="closeMobileMenu">作者</router-link>
        <router-link to="/yiyan" class="nav-link" @click="closeMobileMenu">一言</router-link>
        <router-link to="/about" class="nav-link" @click="closeMobileMenu">关于</router-link>
      </nav>
      
      <div class="header-actions">
        <div class="search-box" @click="goToSearch">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            class="search-input" 
            placeholder="搜索作品、作者..."
            readonly
          />
        </div>
        
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span class="menu-icon">{{ isMobileMenuOpen ? '✕' : '☰' }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function goToSearch() {
  router.push('/search')
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: rgba(250, 248, 245, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--color-primary);
}

.logo-img {
  height: 32px;
  width: auto;
}

.nav-menu {
  display: flex;
  gap: var(--spacing-xl);
}

.nav-link {
  font-size: 15px;
  color: var(--color-primary);
  text-decoration: none;
  padding: var(--spacing-sm) 0;
  position: relative;
  transition: color var(--transition-fast);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-accent);
  transition: width var(--transition-normal);
}

.nav-link:hover {
  color: var(--color-accent);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-link.router-link-active {
  color: var(--color-accent);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.search-box {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: 20px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-box:hover {
  background: var(--color-border);
  transform: scale(1.02);
}

.search-icon {
  font-size: 14px;
  opacity: 0.6;
}

.search-input {
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--color-secondary);
  width: 160px;
  outline: none;
}

.search-input::placeholder {
  color: var(--color-secondary);
  opacity: 0.7;
}

.mobile-menu-btn {
  display: none;
  padding: var(--spacing-sm);
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 var(--spacing-md);
  }

  .logo-text {
    font-size: 16px;
  }

  .nav-menu {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    background: var(--color-bg-primary);
    flex-direction: column;
    padding: var(--spacing-lg);
    gap: var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-normal);
  }

  .nav-menu.is-active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-link {
    font-size: 16px;
    padding: var(--spacing-md) 0;
  }

  .search-box {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .search-input {
    width: 100px;
    font-size: 13px;
  }

  .mobile-menu-btn {
    display: block;
  }
}
</style>
