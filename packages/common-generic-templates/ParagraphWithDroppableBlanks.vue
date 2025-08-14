<template>
  <div class="mb-6">
    <div
      class="p-6 border border-gray-300 rounded-lg bg-white text-lg text-gray-800"
      style="white-space: normal; line-height: 1.8; letter-spacing: 0.02em;"
    >
      <template v-for="(part, idx) in parsedParagraph">
        <span v-if="part.type === 'text'" :key="'text-' + idx">
          {{ part.text.replace(/\n/g, ' ') }}
        </span>

        <span
          v-else
          :key="'blank-' + idx"
          class="inline-block border-b-2 border-black px-4 mx-1 min-w-[40px] text-center align-baseline"
          @dragover.prevent
          @drop="$emit('drop', part.id, $event)"
        >
          {{ getBlankValue(part.id) || '____' }}
        </span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    parsedParagraph: Array,
    getBlankValue: Function
  }
}
</script>
