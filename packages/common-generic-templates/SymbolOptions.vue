<template>
  <div class="lg:w-1/4 p-4 grid grid-cols-3 gap-2 border border-gray-300">
    <button
      v-for="symbol in symbols"
      :key="symbol.id"
      @click="$emit('assign', symbol.symbol)"
      class="border p-2 rounded text-lg hover:bg-gray-200"
    >
      {{ symbol.symbol }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    symbols: Array
  }
}
</script>
