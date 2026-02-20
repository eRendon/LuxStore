import { ref, onMounted, computed } from 'vue'
import type { Product as ApiProduct, ProductsResponse, Product } from '@/lib/types'
import { getProducts, getCategories, getProductsByCategory, searchProducts } from '@/lib/api'

const products = ref<ApiProduct[]>([])
const categories = ref<string[]>([])
const loading = ref(true)
const error = ref<Error | null>(null)
const total = ref(0)
const limit = ref(8)
const skip = ref(0)

// State to remember the last query
let currentFetchType: 'all' | 'category' | 'search' = 'all'
let currentQueryValue = ''

const mapProduct = (p: ApiProduct): Product => ({
  id: p.id,
  title: p.title,
  category: p.category,
  price: p.price,
  thumbnail: p.thumbnail,
  description: p.description,
  rating: p.rating,
  stock: p.stock,
  brand: p.brand,
  images: p.images,
  isFavorite: false, // Default value
  discountPercentage: p.discountPercentage, // Example logic for tag
  // salePercentage: p.discountPercentage > 0 ? Math.round(p.discountPercentage) : undefined
})

export function useProducts() {
  const totalPages = computed(() => Math.ceil(total.value / limit.value))
  const currentPage = computed(() => Math.floor(skip.value / limit.value) + 1)

  const _fetchProducts = async (newSkip: number = 0) => {
    try {
      loading.value = true
      const response: ProductsResponse = await getProducts(limit.value, newSkip)

      // Map data from API format to the format our UI components expect
      products.value = response.products.map(mapProduct)
      total.value = response.total
      skip.value = response.skip
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  const fetchProducts = async () => {
    currentFetchType = 'all'
    currentQueryValue = ''
    await _fetchProducts(0)
  }

  const fetchCategories = async () => {
    try {
      loading.value = true
      const response: string[] = await getCategories()
      // Add 'All Products' to the beginning of the list
      categories.value = ['All Products', ...response]
    } catch (e) {
      console.log(e)
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  const _fetchProductsByCategory = async (category: string, newSkip: number = 0) => {
    loading.value = true
    try {
      const response: ProductsResponse = await getProductsByCategory(category, limit.value, newSkip)
      products.value = response.products.map(mapProduct)
      total.value = response.total
      skip.value = response.skip
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  const fetchProductsByCategory = async (category: string) => {
    if (category === 'All Products') {
      await fetchProducts()
      return
    }
    currentFetchType = 'category'
    currentQueryValue = category
    await _fetchProductsByCategory(category, 0)
  }

  const _fetchSearchProducts = async (query: string, newSkip: number = 0) => {
    loading.value = true
    try {
      const response: ProductsResponse = await searchProducts(query, limit.value, newSkip)
      products.value = response.products.map(mapProduct)
      total.value = response.total
      skip.value = response.skip
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  const fetchSearchProducts = async (query: string) => {
    if (!query) {
      await fetchProducts()
      return
    }
    currentFetchType = 'search'
    currentQueryValue = query
    await _fetchSearchProducts(query, 0)
  }

  const changePage = async (page: number) => {
    const newSkip = (page - 1) * limit.value
    switch (currentFetchType) {
      case 'all':
        await _fetchProducts(newSkip)
        break
      case 'category':
        await _fetchProductsByCategory(currentQueryValue, newSkip)
        break
      case 'search':
        await _fetchSearchProducts(currentQueryValue, newSkip)
        break
    }
  }

  onMounted(() => {
    if (products.value.length === 0) {
      fetchProducts()
      fetchCategories()
    }
  })

  return {
    products,
    loading,
    error,
    categories,
    total,
    limit,
    skip,
    currentPage,
    totalPages,
    fetchProductsByCategory,
    fetchSearchProducts,
    changePage,
  }
}
