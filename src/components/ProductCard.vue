<script setup lang="ts">
import type { Product } from '@/lib/types'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

defineProps<{
  product: Product
}>()
</script>

<template>
  <div
    class="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
  >
    <div class="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
      <img
        :alt="product.title"
        :src="product.images[0]"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <button
        class="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-400 shadow-sm transition-colors hover:text-red-500 dark:bg-slate-800/90"
        :class="{ 'text-red-500': product.isFavorite }"
      >
        <Icon
          :icon="
            product.isFavorite ? 'material-symbols:favorite' : 'material-symbols:favorite-outline'
          "
          class="text-[20px] leading-none"
        />
      </button>
      <!-- <div
        v-if="product.tag === 'Best Seller'"
        class="absolute bottom-3 left-3 rounded bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
      >
        Best Seller
      </div> -->
      <!-- <div
        v-if="product.tag === 'Sale'"
        class="absolute bottom-3 left-3 rounded bg-red-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
      >
        Sale {{ product.salePercentage }}%
      </div> -->
    </div>
    <div class="flex flex-1 flex-col p-5">
      <div class="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
        {{ product.category }}
      </div>
      <h3 class="mb-2 text-lg font-semibold leading-tight text-slate-900 dark:text-white">
        {{ product.title }}
      </h3>
      <div class="mt-auto">
        <div class="mb-4">
          <div v-if="product.oldPrice" class="flex items-center gap-2">
            <span class="text-xl font-bold text-slate-900 dark:text-white"
              >${{ product.price.toFixed(2) }}</span
            >
            <span class="text-sm text-slate-400 line-through"
              >${{ product.oldPrice.toFixed(2) }}</span
            >
          </div>
          <div v-else class="text-xl font-bold text-slate-900 dark:text-white">
            ${{ product.price.toFixed(2) }}
          </div>
        </div>
        <RouterLink
          :to="`/product/${product.id}`"
          class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          View Details
        </RouterLink>
      </div>
    </div>
  </div>
</template>
