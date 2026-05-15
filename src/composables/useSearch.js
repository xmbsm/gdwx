import { ref, computed } from 'vue'
import { useSearchStore } from '../stores/search.js'

export function useSearch() {
  const searchStore = useSearchStore()
  const inputValue = ref('')
  
  const results = computed(() => searchStore.results)
  const isSearching = computed(() => searchStore.isSearching)
  const history = computed(() => searchStore.history)
  const hasResults = computed(() => searchStore.results.length > 0)
  
  function search(query) {
    if (!query.trim()) {
      searchStore.clearResults()
      return
    }
    searchStore.search(query)
  }
  
  function clearResults() {
    inputValue.value = ''
    searchStore.clearResults()
  }
  
  function clearHistory() {
    searchStore.clearHistory()
  }
  
  function handleSearch() {
    search(inputValue.value)
  }
  
  return {
    inputValue,
    results,
    isSearching,
    history,
    hasResults,
    search,
    clearResults,
    clearHistory,
    handleSearch
  }
}
