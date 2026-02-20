<script setup lang="ts">
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import Paginator from '@/components/Paginator.vue'
import { useProducts } from '@/composables/useProducts'

const {
  products,
  loading,
  error,
  categories,
  fetchProductsByCategory,
  currentPage,
  totalPages,
  changePage,
  total,
  limit,
  skip,
} = useProducts()

const getByCategory = (category: string) => {
  activeCategory.value = category
  fetchProductsByCategory(category)
}

const activeCategory = ref('All Products')
const sortBy = ref('featured')

const sortProducts = () => {
  switch (sortBy.value) {
    case 'priceLow':
      products.value.sort((a, b) => a.price - b.price)
      break
    case 'priceHigh':
      products.value.sort((a, b) => b.price - a.price)
      break
    case 'newst':
      products.value.sort((a, b) => b.id - a.id)
      break
    default:
      products.value.sort((a, b) => a.id - b.id)
  }
}
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Category Navigation -->
    <div class="no-scrollbar flex items-center gap-3 overflow-x-auto pb-6">
      <button
        v-for="category in categories"
        :key="category"
        class="shrink-0 cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all"
        :class="
          activeCategory === category
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
            : 'border border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
        "
        @click="getByCategory(category)"
      >
        {{ category }}
      </button>
    </div>
    <!-- Section Header -->
    <div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">New Arrivals</h2>
        <p class="mt-1 text-sm text-slate-500">Discover the latest trends in luxury and tech.</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-slate-500">Sort by:</span>
        <select
          v-model="sortBy"
          @change="sortProducts"
          class="cursor-pointer border-none bg-transparent text-sm font-medium text-slate-900 focus:ring-0 dark:text-white"
        >
          <option value="featured">Featured</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="newst">Newest</option>
        </select>
      </div>
    </div>

    <div v-if="loading && products.length === 0" class="py-12 text-center text-slate-500">
      Loading products...
    </div>
    <div v-else-if="error" class="py-12 text-center text-red-500">
      Failed to load products: {{ error.message }}
    </div>
    <div v-else>
      <!-- Product Grid -->
      <div
        v-if="products.length > 0"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
      <div v-else class="py-12 text-center text-slate-500">
        <p>No products found.</p>
      </div>

      <!-- Pagination -->
      <Paginator
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="total"
        :items-per-page="limit"
        :skip="skip"
        @page-changed="changePage"
      />
    </div>
  </main>
</template>
