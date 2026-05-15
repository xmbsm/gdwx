<template>
  <div class="yiyan-view">
    <div class="yiyan-container">
      <div class="yiyan-badge">原创</div>
      
      <div class="yiyan-content">
        <p class="yiyan-text">{{ currentYiyan.text }}</p>
        <div class="yiyan-source">
          <span class="source-dash">——</span>
          <span class="source-name">「{{ currentYiyan.source }}」</span>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="copy-btn" @click="copyText">
          <span v-if="!copied">复制句子</span>
          <span v-else>已复制</span>
        </button>
        
        <button class="refresh-btn" @click="refreshYiyan" title="换一句">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const yiyanList = [
  { text: '抛开情侣的身份，你是我这一生遇见的最不可多得的挚友。', source: 'nDhnzr6r' },
  { text: '人生若只如初见，何事秋风悲画扇。', source: '纳兰性德' },
  { text: '山有木兮木有枝，心悦君兮君不知。', source: '越人歌' },
  { text: '曾经沧海难为水，除却巫山不是云。', source: '元稹' },
  { text: '愿得一心人，白头不相离。', source: '卓文君' },
  { text: '衣带渐宽终不悔，为伊消得人憔悴。', source: '柳永' },
  { text: '两情若是久长时，又岂在朝朝暮暮。', source: '秦观' },
  { text: '身无彩凤双飞翼，心有灵犀一点通。', source: '李商隐' },
  { text: '执子之手，与子偕老。', source: '诗经' },
  { text: '问世间，情为何物，直教生死相许。', source: '元好问' },
  { text: '天长地久有时尽，此恨绵绵无绝期。', source: '白居易' },
  { text: '多情自古伤离别，更那堪冷落清秋节。', source: '柳永' },
  { text: '春蚕到死丝方尽，蜡炬成灰泪始干。', source: '李商隐' },
  { text: '在天愿作比翼鸟，在地愿为连理枝。', source: '白居易' },
  { text: '红豆生南国，春来发几枝。愿君多采撷，此物最相思。', source: '王维' },
  { text: '玲珑骰子安红豆，入骨相思知不知。', source: '温庭筠' },
  { text: '平生不会相思，才会相思，便害相思。', source: '徐再思' },
  { text: '只愿君心似我心，定不负相思意。', source: '李之仪' },
  { text: '花自飘零水自流，一种相思，两处闲愁。', source: '李清照' },
  { text: '此情可待成追忆，只是当时已惘然。', source: '李商隐' }
]

const currentYiyan = ref(yiyanList[0])
const copied = ref(false)

function refreshYiyan() {
  const randomIndex = Math.floor(Math.random() * yiyanList.length)
  currentYiyan.value = yiyanList[randomIndex]
  copied.value = false
}

function copyText() {
  const text = currentYiyan.value.text
  
  // 尝试使用现代 Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }).catch(() => {
      // 降级使用传统方法
      fallbackCopyText(text)
    })
  } else {
    // 使用传统方法
    fallbackCopyText(text)
  }
}

function fallbackCopyText(text) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  
  try {
    const successful = document.execCommand('copy')
    if (successful) {
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }
  } catch (err) {
    console.error('复制失败:', err)
  }
  
  document.body.removeChild(textarea)
}

onMounted(() => {
  refreshYiyan()
})
</script>

<style scoped>
.yiyan-view {
  padding-top: var(--header-height);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-primary);
}

.yiyan-container {
  max-width: 800px;
  width: 90%;
  padding: var(--spacing-xxl);
  text-align: center;
  position: relative;
}

.yiyan-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-bg-secondary);
  color: var(--color-secondary);
  font-size: 12px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-xl);
}

.yiyan-content {
  margin-bottom: var(--spacing-xl);
}

.yiyan-text {
  font-family: var(--font-classical);
  font-size: 28px;
  line-height: 1.8;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.yiyan-source {
  font-size: 14px;
  color: var(--color-secondary);
}

.source-dash {
  margin-right: var(--spacing-sm);
}

.source-name {
  color: var(--color-accent);
}

.copy-btn {
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.copy-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.refresh-btn {
  width: 44px;
  height: 44px;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.refresh-btn:hover {
  background: var(--color-bg-secondary);
  transform: rotate(180deg);
}

.refresh-btn svg {
  width: 20px;
  height: 20px;
  color: var(--color-secondary);
}

@media (max-width: 768px) {
  .yiyan-text {
    font-size: 22px;
  }
}
</style>
