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
          :class="{ 'opacity-50 cursor-not-allowed': disabled }"
          @dragover.prevent="onDragOver($event)"
          @drop="onDrop(part.id, $event)"
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
    getBlankValue: Function,
    disabled: { type: Boolean, default: false }
  },
   methods: {
    onDragOver(event) {
      if (this.disabled) {
        event.preventDefault(); // block dropping
        event.stopPropagation();
        return false;
      }
      event.preventDefault(); // allow dropping only when not disabled
    },
    onDrop(id, event) {
      if (this.disabled) {
        event.preventDefault(); // block update
        event.stopPropagation();
        return false;
      }
      this.$emit('drop', id, event);
    }
  }
}
</script>
