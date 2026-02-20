<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  skip: number
}>()

const emit = defineEmits<{
  (e: 'page-changed', page: number): void
}>()

const pages = computed(() => {
  const pagesToShow = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pagesToShow.push(i)
    }
  } else {
    pagesToShow.push(1)
    if (current > 3) {
      pagesToShow.push('...')
    }
    if (current > 2) {
      pagesToShow.push(current - 1)
    }
    if (current > 1 && current < total) {
      pagesToShow.push(current)
    }
    if (current < total - 1) {
      pagesToShow.push(current + 1)
    }
    if (current < total - 2) {
      pagesToShow.push('...')
    }
    pagesToShow.push(total)
  }

  // Remove duplicates and consecutive '...'
  return [...new Set(pagesToShow)].filter((page, index, arr) => {
    return page !== '...' || (page === '...' && arr[index - 1] !== '...')
  })
})

const showingFrom = computed(() => props.skip + 1)
const showingTo = computed(() => Math.min(props.skip + props.itemsPerPage, props.totalItems))
</script>
<template>
  <div class="mt-16 flex flex-col items-center gap-4" v-if="totalPages > 1">
    <div class="flex items-center gap-2">
      <button
        class="p-2 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary text-slate-400 hover:text-primary transition-all disabled:opacity-50"
        :disabled="currentPage === 1"
        @click="emit('page-changed', currentPage - 1)"
      >
        <Icon icon="material-symbols:chevron-left" class="leading-none text-xl" />
      </button>
      <template v-for="(page, index) in pages" :key="index">
        <button
          v-if="typeof page === 'number'"
          class="w-10 h-10 hover:bg-blue-500 hover:text-white rounded-lg font-bold text-sm transition-all cursor-pointer"
          :class="
            page === currentPage
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary'
          "
          @click="emit('page-changed', page)"
        >
          {{ page }}
        </button>
        <span v-else class="px-2 text-slate-400">...</span>
      </template>
      <button
        class="p-2 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary text-slate-400 hover:text-primary transition-all"
        :disabled="currentPage === totalPages"
        @click="emit('page-changed', currentPage + 1)"
      >
        <Icon icon="material-symbols:chevron-right" class="leading-none text-xl" />
      </button>
    </div>
    <p class="text-slate-500 text-sm">
      Showing {{ showingFrom }}-{{ showingTo }} of {{ totalItems }} products
    </p>
  </div>
</template>
