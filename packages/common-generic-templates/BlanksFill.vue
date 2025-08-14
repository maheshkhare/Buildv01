<template>
  <div class="flex flex-col gap-2 bg-gray-100 p-4 rounded-md shadow-md w-fit">
    <div
      v-for="blank in blanks"
      :key="blank.id"
      class="flex items-center gap-4 text-lg"
    >
      <span v-if="blank.firstSymbol">{{ blank.firstSymbol }}</span>

      <button
        v-for="n in numBlanks(blank)"
        :key="`blank-${blank.id}-index-${n}`"
        class="border-b-2 border-black w-6 h-8 text-center text-lg focus:outline-none"
        @click="$emit('selectBlank', blank.id, n)"
      >
        {{ getBlankValue(blank, n) || '_' }}
      </button>

      <span v-if="blank.lastSymbol">{{ blank.lastSymbol }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    blanks: Array,
    numBlanks: Function,
    getBlankKey: Function // parent passes this
  },
  methods: {
    getBlankValue(blank, n) {
      const key = this.getBlankKey(n); // e.g., "1stBlankValue"
      return blank[key] || '';
    }
  }
}
</script>
