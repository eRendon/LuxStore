<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getProduct } from '@/lib/api'
import type { Product } from '@/lib/types'
import { Icon } from '@iconify/vue'

const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedImage = ref<string>('')
const quantity = ref(1)

const fetchProductData = async () => {
  try {
    loading.value = true
    const id = Number(route.params.id)
    if (isNaN(id)) {
      throw new Error('Invalid product ID')
    }
    const data = await getProduct(id)
    product.value = data
    // Set initial selected image
    if (data.images && data.images.length > 0) {
      selectedImage.value = data.images[0]!
    } else {
      selectedImage.value = data.thumbnail
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load product'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProductData()
})

// Calculate original price based on discount
const originalPrice = computed(() => {
  if (!product.value) return 0
  return product.value.price / (1 - product.value.discountPercentage / 100)
})

const incrementQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decrementQuantity = () => {
  if (quantity.value > 1) quantity.value--
}
</script>

<template>
  <div v-if="loading" class="flex min-h-[50vh] items-center justify-center">
    <div class="text-center">
      <div
        class="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
      ></div>
      <p class="text-slate-500">Loading product details...</p>
    </div>
  </div>

  <div v-else-if="error" class="flex min-h-[50vh] items-center justify-center">
    <div class="text-center text-red-500">
      <Icon icon="material-symbols:error-outline" class="mx-auto mb-2 text-4xl" />
      <p>{{ error }}</p>
      <RouterLink to="/" class="mt-4 inline-block text-primary hover:underline">
        Return to Home
      </RouterLink>
    </div>
  </div>

  <div v-else-if="product" class="min-h-screen bg-background-light dark:bg-background-dark">
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Breadcrumbs -->
      <nav class="mb-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <RouterLink to="/" class="transition-colors hover:text-primary">Home</RouterLink>
        <Icon icon="material-symbols:chevron-right" class="text-base" />
        <span class="cursor-pointer capitalize transition-colors hover:text-primary">{{
          product.category
        }}</span>
        <Icon icon="material-symbols:chevron-right" class="text-base" />
        <span class="max-w-[200px] truncate font-medium text-slate-900 dark:text-slate-100">{{
          product.title
        }}</span>
      </nav>

      <div class="mb-24 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <!-- Left Column: Image Gallery -->
        <div class="space-y-4 lg:col-span-7">
          <div
            class="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
          >
            <img
              :src="selectedImage"
              :alt="product.title"
              class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute right-4 top-4">
              <button
                class="rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:text-primary dark:bg-slate-900/90"
              >
                <Icon icon="material-symbols:zoom-in" class="text-2xl" />
              </button>
            </div>
          </div>
          <div class="grid grid-cols-5 gap-4">
            <button
              v-for="image in product.images"
              :key="image"
              class="aspect-square overflow-hidden rounded-lg border bg-white dark:bg-slate-800"
              :class="
                selectedImage === image
                  ? 'border-2 border-primary'
                  : 'border-slate-200 hover:border-primary dark:border-slate-700'
              "
              @click="selectedImage = image"
            >
              <img :src="image" :alt="product.title" class="h-full w-full object-contain" />
            </button>
          </div>
        </div>

        <!-- Right Column: Product Info -->
        <div class="space-y-6 lg:col-span-5">
          <div class="space-y-2">
            <span
              class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-primary"
            >
              {{ product.brand }}
            </span>
            <h1 class="text-4xl font-black leading-tight text-slate-900 dark:text-slate-50">
              {{ product.title }}
            </h1>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center text-amber-400">
              <Icon icon="material-symbols:star" class="text-xl" />
              <span class="ml-1 text-sm font-bold text-slate-900 dark:text-slate-100">{{
                product.rating
              }}</span>
            </div>
            <span class="text-slate-400">|</span>
            <span
              class="cursor-pointer text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              See reviews
            </span>
          </div>

          <div class="flex items-baseline gap-3">
            <span class="text-3xl font-black text-primary">${{ product.price.toFixed(2) }}</span>
            <span v-if="product.discountPercentage > 0" class="text-lg text-slate-400 line-through">
              ${{ originalPrice.toFixed(2) }}
            </span>
            <span
              v-if="product.discountPercentage > 0"
              class="rounded bg-green-50 px-2 py-1 text-sm font-bold text-green-600 dark:bg-green-900/20 dark:text-green-400"
            >
              Save {{ Math.round(product.discountPercentage) }}%
            </span>
          </div>

          <div class="flex items-center gap-2 py-2">
            <div
              class="h-2.5 w-2.5 rounded-full"
              :class="product.stock > 0 ? 'bg-green-500' : 'bg-red-500'"
            ></div>
            <span class="font-bold text-slate-700 dark:text-slate-300">
              {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </span>
            <span class="text-slate-500 dark:text-slate-400">
              - {{ product.stock }} units left
            </span>
          </div>

          <div class="border-t border-slate-200 pt-6 dark:border-slate-800">
            <h3
              class="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Description
            </h3>
            <p class="leading-relaxed text-slate-600 dark:text-slate-400">
              {{ product.description }}
            </p>
          </div>

          <!-- Static Features (Placeholders as API doesn't provide this specific info) -->
          <div class="grid grid-cols-2 gap-4">
            <div
              class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
            >
              <div class="mb-1 flex items-center gap-2 text-primary">
                <Icon icon="material-symbols:local-shipping" class="text-xl" />
                <span class="text-xs font-bold uppercase tracking-wider">Shipping</span>
              </div>
              <p class="text-sm font-semibold">Free Delivery</p>
              <p class="text-[10px] text-slate-500">On orders over $50</p>
            </div>
            <div
              class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
            >
              <div class="mb-1 flex items-center gap-2 text-primary">
                <Icon icon="material-symbols:verified-user" class="text-xl" />
                <span class="text-xs font-bold uppercase tracking-wider">Warranty</span>
              </div>
              <p class="text-sm font-semibold">2 Years</p>
              <p class="text-[10px] text-slate-500">Full coverage</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Fixed Action Bar -->
    <div
      class="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-background-dark"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <div class="hidden items-center gap-4 sm:flex">
          <div class="h-12 w-12 rounded bg-slate-100 dark:bg-slate-800">
            <img
              :src="product.thumbnail"
              :alt="product.title"
              class="h-full w-full rounded object-cover"
            />
          </div>
          <div>
            <p class="max-w-[200px] truncate text-sm font-bold text-slate-900 dark:text-white">
              {{ product.title }}
            </p>
            <p class="font-black text-primary">${{ product.price.toFixed(2) }}</p>
          </div>
        </div>
        <div class="flex max-w-md flex-1 items-center justify-end gap-3">
          <div
            class="flex h-12 items-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
          >
            <button
              class="h-full px-3 transition-colors hover:text-primary disabled:opacity-50"
              @click="decrementQuantity"
              :disabled="quantity <= 1"
            >
              <Icon icon="material-symbols:remove" class="text-xl" />
            </button>
            <span class="w-8 text-center font-bold text-slate-900 dark:text-white">{{
              quantity
            }}</span>
            <button
              class="h-full px-3 transition-colors hover:text-primary disabled:opacity-50"
              @click="incrementQuantity"
              :disabled="quantity >= product.stock"
            >
              <Icon icon="material-symbols:add" class="text-xl" />
            </button>
          </div>
          <button
            class="hidden h-12 rounded-lg border-2 border-primary px-6 font-bold text-primary transition-colors hover:bg-primary/5 sm:block"
          >
            Add to Cart
          </button>
          <button
            class="h-12 flex-1 rounded-lg bg-primary px-6 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
