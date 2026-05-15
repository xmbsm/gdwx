import { ref, computed } from 'vue'

const contentCache = new Map()

export function useContent() {
  const loading = ref(false)
  const error = ref(null)

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
          if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''))
          } else {
            value = value.replace(/['"]/g, '')
          }
          data[key] = value
        }
      }
    })

    if (isBlockScalar && currentKey) {
      data[currentKey] = currentValue
    }

    return { data, content: bodyContent }
  }

  const getAllBooks = () => {
    const files = getAllMarkdownFiles()
    const books = []

    Object.entries(files).forEach(([path, content]) => {
      const { data, content: bodyContent } = parseFrontmatter(content)
      
      if (data.id && data.title) {
        books.push({
          ...data,
          path,
          content: bodyContent
        })
      }
    })

    return books
  }

  const getBookById = async (id) => {
    if (contentCache.has(id)) {
      return contentCache.get(id)
    }

    const files = getAllMarkdownFiles()
    
    for (const [path, content] of Object.entries(files)) {
      const { data, content: bodyContent } = parseFrontmatter(content)
      
      if (data.id === id) {
        const book = { ...data, path, content: bodyContent }
        contentCache.set(id, book)
        return book
      }
    }

    return null
  }

  const getBooksByCategory = (category) => {
    const allBooks = getAllBooks()
    return allBooks.filter(book => book.category === category)
  }

  const getBooksByDynasty = (dynasty) => {
    const allBooks = getAllBooks()
    return allBooks.filter(book => book.dynasty === dynasty)
  }

  const searchBooks = (keyword) => {
    const allBooks = getAllBooks()
    const lowerKeyword = keyword.toLowerCase()
    
    return allBooks.filter(book => 
      book.title?.toLowerCase().includes(lowerKeyword) ||
      book.author?.toLowerCase().includes(lowerKeyword) ||
      book.summary?.toLowerCase().includes(lowerKeyword) ||
      book.themes?.some(theme => theme.toLowerCase().includes(lowerKeyword))
    )
  }

  const getCategories = () => {
    const allBooks = getAllBooks()
    const categories = [...new Set(allBooks.map(book => book.category).filter(Boolean))]
    return categories
  }

  const getDynasties = () => {
    const allBooks = getAllBooks()
    const dynasties = [...new Set(allBooks.map(book => book.dynasty).filter(Boolean))]
    return dynasties
  }

  return {
    loading,
    error,
    getAllBooks,
    getBookById,
    getBooksByCategory,
    getBooksByDynasty,
    searchBooks,
    getCategories,
    getDynasties
  }
}
