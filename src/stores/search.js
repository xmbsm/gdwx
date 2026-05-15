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

const loadAllContent = () => {
  const files = getAllMarkdownFiles()
  const items = []

  Object.entries(files).forEach(([path, content]) => {
    const { data } = parseFrontmatter(content)
    
    if (data.id && data.title) {
      const category = path.includes('/poems/') ? 'poems' : 
                       path.includes('/classics/') ? 'classics' : 'works'
      const typeName = category === 'poems' ? '诗词' : 
                      category === 'classics' ? '名著' : '其他作品'
      
      items.push({
        ...data,
        path,
        type: category,
        typeName
      })
    }
  })

  return items
}

let cachedData = null

const getAllData = () => {
  if (!cachedData) {
    cachedData = loadAllContent()
  }
  return cachedData
}

export const useSearchStore = defineStore('search', {
  state: () => ({
    query: '',
    results: [],
    isSearching: false,
    history: JSON.parse(localStorage.getItem('searchHistory') || '[]')
  }),
  
  actions: {
    search(query) {
      this.query = query
      this.isSearching = true
      
      const lowerQuery = query.toLowerCase()
      const allData = getAllData()
      
      this.results = allData.filter(item => {
        const searchText = `${item.title} ${item.author} ${item.summary || ''} ${item.famousLines || ''}`.toLowerCase()
        return searchText.includes(lowerQuery)
      }).map(item => {
        let score = 0
        if (item.title?.toLowerCase().includes(lowerQuery)) score += 100
        if (item.author?.toLowerCase().includes(lowerQuery)) score += 80
        if (item.famousLines && item.famousLines.toLowerCase().includes(lowerQuery)) score += 60
        if (item.summary && item.summary.toLowerCase().includes(lowerQuery)) score += 40
        return { ...item, score }
      }).sort((a, b) => b.score - a.score)
      
      this.isSearching = false
      
      if (query && !this.history.includes(query)) {
        this.addToHistory(query)
      }
    },
    
    addToHistory(query) {
      this.history = [query, ...this.history.filter(h => h !== query)].slice(0, 10)
      localStorage.setItem('searchHistory', JSON.stringify(this.history))
    },
    
    clearHistory() {
      this.history = []
      localStorage.removeItem('searchHistory')
    },
    
    clearResults() {
      this.query = ''
      this.results = []
    }
  }
})
