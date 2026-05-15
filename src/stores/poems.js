import { defineStore } from 'pinia'

const getAllMarkdownFiles = () => {
  return import.meta.glob('/src/content/**/*.md', { eager: true, as: 'raw' })
}

const parseFrontmatter = (content) => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { data: {}, content: content }
  }

  const frontmatterStr = match[1]
  const bodyContent = match[2]
  
  const data = {}
  const lines = frontmatterStr.split('\n')
  let currentKey = null
  let currentValue = ''
  let isBlockScalar = false
  let indentLevel = 0

  lines.forEach(line => {
    if (isBlockScalar) {
      if (line.trim() === '') {
        currentValue += '\n'
      } else {
        const lineIndent = line.search(/\S/)
        if (lineIndent >= indentLevel && lineIndent !== -1) {
          currentValue += (currentValue ? '\n' : '') + line.trim()
        } else {
          data[currentKey] = currentValue
          currentKey = null
          currentValue = ''
          isBlockScalar = false
          if (line.includes(':')) {
            const colonIndex = line.indexOf(':')
            const key = line.substring(0, colonIndex).trim()
            const value = line.substring(colonIndex + 1).trim()
            if (value.endsWith('|')) {
              currentKey = key
              isBlockScalar = true
              indentLevel = line.search(/\S/) + 2
            } else if (value) {
              data[key] = value.replace(/['"]/g, '')
            }
          }
        }
      }
    } else if (line.includes(':')) {
      const colonIndex = line.indexOf(':')
      const key = line.substring(0, colonIndex).trim()
      let value = line.substring(colonIndex + 1).trim()
      if (value.endsWith('|')) {
        currentKey = key
        isBlockScalar = true
        indentLevel = line.search(/\S/) + 2
        currentValue = ''
      } else if (value) {
        data[key] = value.replace(/['"]/g, '')
      }
    }
  })

  if (isBlockScalar && currentKey) {
    data[currentKey] = currentValue
  }

  return { data, content: bodyContent }
}

const loadPoems = () => {
  const files = getAllMarkdownFiles()
  const poems = []

  Object.entries(files).forEach(([path, content]) => {
    if (path.includes('/poems/')) {
      const { data, content: bodyContent } = parseFrontmatter(content)
      
      if (data.id && data.title) {
        poems.push({
          ...data,
          path,
          content: bodyContent
        })
      }
    }
  })

  return poems
}

export const usePoemsStore = defineStore('poems', {
  state: () => ({
    poemsList: loadPoems(),
    currentPoem: null,
    loading: false
  }),
  
  getters: {
    getPoemById: (state) => (id) => {
      return state.poemsList.find(p => p.id === id)
    },
    getPoemsByDynasty: (state) => (dynasty) => {
      return state.poemsList.filter(p => p.dynasty === dynasty)
    },
    getPoemsByCategory: (state) => (category) => {
      return state.poemsList.filter(p => p.category === category)
    },
    getAllDynasties: (state) => {
      return [...new Set(state.poemsList.map(p => p.dynasty))]
    },
    getAllCategories: (state) => {
      return [...new Set(state.poemsList.map(p => p.category).filter(Boolean))]
    },
    getPrevPoem: (state) => (id) => {
      const index = state.poemsList.findIndex(p => p.id === id)
      if (index > 0) {
        return state.poemsList[index - 1]
      }
      return null
    },
    getNextPoem: (state) => (id) => {
      const index = state.poemsList.findIndex(p => p.id === id)
      if (index >= 0 && index < state.poemsList.length - 1) {
        return state.poemsList[index + 1]
      }
      return null
    }
  },
  
  actions: {
    setCurrentPoem(id) {
      this.currentPoem = this.getPoemById(id)
    }
  }
})
