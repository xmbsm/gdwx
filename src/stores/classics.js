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

const loadAllBooks = () => {
  const files = getAllMarkdownFiles()
  const books = []

  Object.entries(files).forEach(([path, content]) => {
    if (path.includes('/classics/')) {
      const { data } = parseFrontmatter(content)
      
      if (data.id && data.title) {
        books.push({
          ...data,
          path
        })
      }
    }
  })

  return books
}

export const useClassicsStore = defineStore('classics', {
  state: () => ({
    classicsList: loadAllBooks(),
    currentClassic: null,
    loading: false
  }),
  
  getters: {
    getClassicById: (state) => (id) => {
      return state.classicsList.find(c => c.id === id)
    },
    
    getClassicsByCategory: (state) => (category) => {
      return state.classicsList.filter(c => c.category === category)
    },
    
    getCategories: (state) => {
      const categories = [...new Set(state.classicsList.map(c => c.category).filter(Boolean))]
      return categories
    },
    
    getDynasties: (state) => {
      const dynasties = [...new Set(state.classicsList.map(c => c.dynasty).filter(Boolean))]
      return dynasties
    }
  },
  
  actions: {
    setCurrentClassic(id) {
      this.currentClassic = this.getClassicById(id)
    },
    
    searchClassics(keyword) {
      const lowerKeyword = keyword.toLowerCase()
      return this.classicsList.filter(book => 
        book.title?.toLowerCase().includes(lowerKeyword) ||
        book.author?.toLowerCase().includes(lowerKeyword) ||
        book.summary?.toLowerCase().includes(lowerKeyword)
      )
    }
  }
})
