<template>
  <div class="flex justify-center mt-2">
    <button
      @click="$emit('save-and-exit')"
      class="text-blue-700 font-semibold cursor-pointer px-3 py-1 rounded hover:bg-blue-100 inline-block"
      :style="{ fontSize: '18px', marginLeft: '22px' }"
      type="button"
    >
      💾 Save and Exit
    </button>
  </div>
</template>

<script>
export default {
  name: 'SaveExitButton',
};
</script>
