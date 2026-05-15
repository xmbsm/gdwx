<template>
  <transition name="back-to-top-fade">
    <button 
      v-if="isVisible"
      class="back-to-top"
      @click="scrollToTop"
    >
      <span class="back-icon">↑</span>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  visibleHeight: {
    type: Number,
    default: 300
  },
  duration: {
    type: Number,
    default: 500
  }
})

const isVisible = ref(false)

function handleScroll() {
  isVisible.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 48px;
  height: 48px;
  background: var(--color-accent);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 20px;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-normal);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-to-top:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(201, 169, 110, 0.4);
}

.back-to-top:active {
  transform: translateY(-2px);
}

.back-icon {
  line-height: 1;
}

.back-to-top-fade-enter-active,
.back-to-top-fade-leave-active {
  transition: all 0.3s ease;
}

.back-to-top-fade-enter-from,
.back-to-top-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}
</style>
