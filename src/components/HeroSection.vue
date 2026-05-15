<template>
  <section class="hero-section" ref="heroSection" @mousemove="handleMouseMove" @click="handleClick" :class="{ 'cursor-pointer': isNearParticle }">
    <div class="hero-bg">
      <canvas ref="canvas"></canvas>
    </div>
    
    <div class="paper-mask"></div>
    
    <div class="paper-holes">
      <div v-for="i in 13" :key="i" class="paper-hole"></div>
    </div>
    
    <div class="hero-container">
      <header class="hero-header">
        <h1 class="hero-title">识典古籍</h1>
      </header>
      
      <div class="hero-search" ref="heroSearch">
        <div class="search-wrapper">
          <input 
            type="text" 
            class="search-input" 
            placeholder="请输入要搜索的关键词"
            v-model="heroSearchQuery"
            @keyup.enter="goToSearch"
            @click.stop
          />
          <select class="search-dropdown" @click.stop>
            <option value="">高级检索</option>
            <option value="title">按标题</option>
            <option value="author">按作者</option>
            <option value="content">按内容</option>
          </select>
          <button class="search-btn" @click="goToSearch">
            <span>🔍</span>
          </button>
        </div>
        <p class="search-stats">
          共收录 <span class="stat-number">{{ totalBooks }}</span> 部书籍，
          <router-link to="/library" class="view-library" @click.stop>查看书库 →</router-link>
        </p>
      </div>
      
      <div class="hero-hint">
        <span class="hint-icon">✨</span>
        <span class="hint-text">点击周围的光点，发现经典</span>
      </div>
      
    </div>
    
    <div class="scroll-hint" @click="scrollToContent">
      <span class="scroll-text">向下滚动</span>
      <div class="scroll-arrow">
        <span class="arrow-icon">↓</span>
      </div>
    </div>
    
    <Transition name="fade">
      <div v-if="showPopup" class="discovery-popup" @click.stop>
        <button class="popup-close" @click="closePopup">×</button>
        <div class="popup-content">
          <span class="popup-type">{{ popupData.type }}</span>
          <h3 class="popup-title">{{ popupData.title }}</h3>
          <p class="popup-author" v-if="popupData.author">{{ popupData.author }}</p>
          <p class="popup-dynasty" v-if="popupData.dynasty">{{ popupData.dynasty }}</p>
          <p class="popup-excerpt" v-if="popupData.excerpt">{{ popupData.excerpt }}</p>
          <button class="popup-read-more" @click="goToDetail">
           阅读全文 →
          </button>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClassicsStore } from '../stores/classics.js'
import { usePoemsStore } from '../stores/poems.js'
import { useWorksStore } from '../stores/works.js'

const router = useRouter()
const heroSection = ref(null)
const heroSearch = ref(null)
const canvas = ref(null)
const heroSearchQuery = ref('')
const showPopup = ref(false)
const popupData = ref({})
const isNearParticle = ref(false)

const classicsStore = useClassicsStore()
const poemsStore = usePoemsStore()
const worksStore = useWorksStore()

const totalBooks = computed(() => {
  return classicsStore.classicsList.length + poemsStore.poemsList.length + worksStore.worksList.length
})

let ctx = null
let animationId = null
let particles = []
let mouseX = 0
let mouseY = 0

class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 4 + 3
    this.baseSpeedX = (Math.random() - 0.5) * 0.3
    this.baseSpeedY = (Math.random() - 0.5) * 0.3
    this.speedX = this.baseSpeedX
    this.speedY = this.baseSpeedY
    this.opacity = Math.random() * 0.5 + 0.3
    this.pulseSpeed = Math.random() * 0.02 + 0.01
    this.pulseOffset = Math.random() * Math.PI * 2
    this.clickable = Math.random() > 0.3
    this.highlighted = false
  }

  update(mouseX, mouseY) {
    const dx = mouseX - this.x
    const dy = mouseY - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    if (dist < 60) {
      this.highlighted = true
    } else {
      this.highlighted = false
    }
    
    this.speedX += (this.baseSpeedX - this.speedX) * 0.02
    this.speedY += (this.baseSpeedY - this.speedY) * 0.02
    
    this.x += this.speedX
    this.y += this.speedY
    
    if (this.x < 0) this.x = this.canvas.width
    if (this.x > this.canvas.width) this.x = 0
    if (this.y < 0) this.y = this.canvas.height
    if (this.y > this.canvas.height) this.y = 0
    
    this.opacity = 0.3 + Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 0.3
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    
    if (this.clickable && this.highlighted) {
      ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity + 0.4})`
      ctx.shadowColor = 'rgba(255, 215, 0, 1)'
      ctx.shadowBlur = 25
    } else if (this.clickable) {
      ctx.fillStyle = `rgba(255, 200, 50, ${this.opacity + 0.3})`
      ctx.shadowColor = 'rgba(255, 200, 50, 0.8)'
      ctx.shadowBlur = 15
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
      ctx.shadowBlur = 0
    }
    
    ctx.fill()
    ctx.shadowBlur = 0
  }
}

function initCanvas() {
  if (!canvas.value || !heroSection.value) return
  
  const rect = heroSection.value.getBoundingClientRect()
  canvas.value.width = rect.width
  canvas.value.height = rect.height
  
  ctx = canvas.value.getContext('2d')
  
  particles = []
  const particleCount = Math.min(50, Math.floor((canvas.value.width * canvas.value.height) / 18000))
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas.value))
  }
  
  animate()
}

function animate() {
  if (!ctx || !canvas.value) return
  
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  particles.forEach(particle => {
    particle.update(mouseX, mouseY)
    particle.draw(ctx)
  })
  
  animationId = requestAnimationFrame(animate)
}

function handleMouseMove(e) {
  if (!heroSection.value) return
  const rect = heroSection.value.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
  
  let nearParticle = false
  for (const particle of particles) {
    if (!particle.clickable) continue
    const dx = mouseX - particle.x
    const dy = mouseY - particle.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    if (dist < particle.size + 20) {
      nearParticle = true
      break
    }
  }
  isNearParticle.value = nearParticle
}

function handleClick(e) {
  // 检查点击是否在搜索区域内
  if (heroSearch.value) {
    const searchRect = heroSearch.value.getBoundingClientRect()
    if (
      e.clientX >= searchRect.left && 
      e.clientX <= searchRect.right && 
      e.clientY >= searchRect.top && 
      e.clientY <= searchRect.bottom
    ) {
      return // 点击在搜索区域内，不显示弹窗
    }
  }

  if (!heroSection.value) return
  const rect = heroSection.value.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const clickY = e.clientY - rect.top
  
  let clicked = false
  for (const particle of particles) {
    if (!particle.clickable) continue
    const dx = clickX - particle.x
    const dy = clickY - particle.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    if (dist < particle.size + 10) {
      showRandomContent()
      clicked = true
      break
    }
  }
}

function showRandomContent() {
  const rand = Math.random()
  let data
  
  if (rand < 0.4) {
    const classics = classicsStore.classicsList
    const item = classics[Math.floor(Math.random() * classics.length)]
    data = {
      type: '名著',
      title: item.title,
      author: item.author,
      dynasty: item.dynasty,
      excerpt: item.summary,
      id: item.id,
      routeType: 'classics'
    }
  } else if (rand < 0.75) {
    const poems = poemsStore.poemsList
    const item = poems[Math.floor(Math.random() * poems.length)]
    data = {
      type: '诗词',
      title: item.title,
      author: item.author,
      dynasty: item.dynasty,
      excerpt: item.fullText.substring(0, 100) + '...',
      id: item.id,
      routeType: 'poems'
    }
  } else {
    const works = worksStore.worksList
    const item = works[Math.floor(Math.random() * works.length)]
    data = {
      type: '作品',
      title: item.title,
      author: item.author,
      dynasty: item.dynasty,
      excerpt: item.summary,
      id: item.id,
      routeType: 'works'
    }
  }
  
  popupData.value = data
  showPopup.value = true
}

function closePopup() {
  showPopup.value = false
}

function goToDetail() {
  if (!popupData.value.id) return
  closePopup()
  if (popupData.value.routeType === 'classics') {
    router.push(`/classics/${popupData.value.id}`)
  } else if (popupData.value.routeType === 'poems') {
    router.push(`/poems/${popupData.value.id}`)
  } else {
    router.push(`/works/${popupData.value.id}`)
  }
}

function goToSearch() {
  if (heroSearchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(heroSearchQuery.value)}`)
  } else {
    router.push('/search')
  }
}

function scrollToContent() {
  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth'
  })
}

function handleResize() {
  initCanvas()
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: default;
}

.hero-section.cursor-pointer {
  cursor: pointer;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: linear-gradient(180deg, 
      rgba(245, 243, 238, 1) 0%, 
      rgba(248, 246, 241, 1) 30%, 
      rgba(250, 248, 243, 1) 50%, 
      rgba(248, 246, 241, 1) 70%, 
      rgba(245, 243, 238, 1) 100%
    );
}

.hero-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.12;
  pointer-events: none;
}

.hero-bg::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 38px,
      rgba(201, 169, 110, 0.18) 38px,
      rgba(201, 169, 110, 0.18) 40px
    );
  pointer-events: none;
}

.hero-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.12;
  pointer-events: none;
}

.paper-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: 
    linear-gradient(to bottom, 
      rgba(245, 243, 238, 1) 0%, 
      rgba(245, 243, 238, 0.8) 10%, 
      rgba(245, 243, 238, 0.4) 20%, 
      rgba(245, 243, 238, 0) 30%, 
      rgba(245, 243, 238, 0) 70%, 
      rgba(245, 243, 238, 0.4) 80%, 
      rgba(245, 243, 238, 0.8) 90%, 
      rgba(245, 243, 238, 1) 100%
    ),
    linear-gradient(to right, 
      rgba(245, 243, 238, 1) 0%, 
      rgba(245, 243, 238, 0.7) 10%, 
      rgba(245, 243, 238, 0.3) 20%, 
      rgba(245, 243, 238, 0) 35%, 
      rgba(245, 243, 238, 0) 65%, 
      rgba(245, 243, 238, 0.3) 80%, 
      rgba(245, 243, 238, 0.7) 90%, 
      rgba(245, 243, 238, 1) 100%
    );
  pointer-events: none;
}

.paper-holes {
  position: absolute;
  top: 14px;
  left: 0;
  width: 100%;
  height: 24px;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  pointer-events: none;
}

.paper-hole {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(200, 195, 185, 0.8), rgba(180, 175, 165, 0.6));
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
}

@keyframes paperFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes paperBreath {
  0%, 100% {
    opacity: 0.95;
  }
  50% {
    opacity: 1;
  }
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}



.hero-container {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: var(--spacing-lg);
  width: 100%;
  max-width: 1600px;
}

.hero-header {
  margin-bottom: var(--spacing-xxl);
}

.hero-title {
  font-family: var(--font-display);
  font-size: 56px;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 12px;
  text-shadow: 0 2px 20px rgba(201, 169, 110, 0.3);
}

.hero-search {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  margin-top: -15px;
}

.search-wrapper {
  display: flex;
  width: 100%;
  background: white;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.search-input {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  font-size: 15px;
  outline: none;
  color: var(--color-primary);
}

.search-input::placeholder {
  color: var(--color-secondary);
  opacity: 0.6;
}

.search-dropdown {
  padding: var(--spacing-md) var(--spacing-md);
  border: none;
  border-left: 1px solid var(--color-border);
  font-size: 14px;
  color: var(--color-secondary);
  cursor: pointer;
  outline: none;
}

.search-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-accent);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.search-btn:hover {
  background: #b89a5e;
}

.search-stats {
  font-size: 14px;
  color: var(--color-secondary);
  margin-top: var(--spacing-md);
}

.stat-number {
  font-weight: 600;
  color: var(--color-accent);
}

.view-library {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
}

.view-library:hover {
  text-decoration: underline;
}

.hero-hint {
  margin-top: var(--spacing-xxl);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--color-secondary);
  font-size: 12px;
  opacity: 0.8;
  animation: pulse 2s ease-in-out infinite;
}

.hint-icon {
  font-size: 14px;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-3px); }
}

.scroll-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  animation: scrollPulse 2s ease-in-out infinite;
  z-index: 10;
}

.scroll-text {
  font-size: 12px;
  color: var(--color-secondary);
  opacity: 0.7;
  letter-spacing: 1px;
}

.scroll-arrow {
  width: 30px;
  height: 40px;
  border: 1.5px solid rgba(136, 136, 136, 0.3);
  border-radius: 15px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 7px;
}

.arrow-icon {
  font-size: 12px;
  color: var(--color-secondary);
  opacity: 0.7;
  animation: bounceArrow 1.5s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes bounceArrow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

.discovery-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 450px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: hidden;
}

.popup-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 32px;
  height: 32px;
  border: none;
  background: var(--color-bg-secondary);
  border-radius: 50%;
  font-size: 20px;
  color: var(--color-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.popup-close:hover {
  background: var(--color-accent);
  color: white;
}

.popup-content {
  padding: var(--spacing-xxl);
  text-align: center;
}

.popup-type {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-accent);
  color: white;
  font-size: 12px;
  border-radius: 50px;
  margin-bottom: var(--spacing-md);
}

.popup-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.popup-author,
.popup-dynasty {
  font-size: 14px;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-xs);
}

.popup-excerpt {
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-primary);
  margin: var(--spacing-lg) 0;
  text-align: left;
  padding: var(--spacing-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-accent);
}

.popup-read-more {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.popup-read-more:hover {
  transform: translateX(3px);
  box-shadow: 0 4px 12px rgba(201, 169, 110, 0.4);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 100vh;
    padding: var(--spacing-lg) 0;
  }

  .hero-title {
    font-size: 36px;
    letter-spacing: 6px;
  }

  .search-wrapper {
    flex-wrap: nowrap;
  }

  .search-dropdown {
    display: none;
  }

  .hero-hint {
    font-size: 12px;
  }

  .scroll-hint {
    bottom: 40px;
  }

  .scroll-text {
    font-size: 12px;
  }

  .discovery-popup {
    width: 95%;
  }

  .popup-content {
    padding: var(--spacing-lg);
  }

  .popup-title {
    font-size: 22px;
  }
}
</style>
