<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useProducts } from '@/composables/useProducts'
import { ref } from 'vue'

const { fetchSearchProducts } = useProducts()

const query = ref('')

const searchProducts = () => {
  console.log(query.value)
  fetchSearchProducts(query.value)
}
</script>

<template>
  <!-- Global Header -->
  <header
    class="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-background-dark/80"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between gap-8">
        <!-- Logo -->
        <div class="flex shrink-0 items-center gap-2">
          <div class="rounded-lg bg-primary p-2 text-white">
            <!-- <span class="material-symbols-outlined block">diamond</span> -->
            <Icon icon="mdi-light:diamond" class="block text-2xl text-blue-500" />
          </div>
          <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">LuxeStore</h1>
        </div>
        <!-- Search Bar -->
        <div class="hidden flex-1 max-w-2xl md:block">
          <div class="relative group">
            <div
              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 transition-colors group-focus-within:text-primary"
            >
              <!-- <span class="material-symbols-outlined text-[20px]">search</span> -->
              <Icon icon="material-symbols:search" class="text-[20px]" />
            </div>
            <input
              class="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800"
              placeholder="Search for products, brands and more..."
              type="text"
              v-model="query"
              @keyup.enter="searchProducts"
            />
          </div>
        </div>
        <!-- Action Icons -->
        <div class="flex shrink-0 items-center gap-2 sm:gap-4">
          <button
            class="relative p-2 text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
          >
            <!-- <span class="material-symbols-outlined">shopping_cart</span> -->
            <Icon icon="material-symbols:shopping-cart" class="text-2xl" />
            <span
              class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
              >3</span
            >
          </button>
          <button
            class="p-2 text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
          >
            <!-- <span class="material-symbols-outlined">person</span> -->
            <Icon icon="material-symbols:person" class="text-2xl" />
          </button>
          <button class="p-2 text-slate-600 dark:text-slate-400 md:hidden">
            <!-- <span class="material-symbols-outlined">menu</span> -->
            <Icon icon="material-symbols:menu" class="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
