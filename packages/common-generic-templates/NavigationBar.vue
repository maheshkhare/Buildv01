<template>
  <div class="flex justify-between w-full mt-6 items-center">
    <button class="px-4 py-2 bg-blue-500 text-white rounded" @click="$emit('prev')">
      Previous
    </button>
    <p class="font-semibold text-center mx-4">
      Question - {{ current + 1 }} of {{ total }}
    </p>
    <button class="px-4 py-2 bg-green-500 text-white rounded" @click="$emit('next')">
      Next
    </button>
  </div>
</template>

<script>
export default {
  props: {
    current: Number,
    total: Number
  }
}
</script>
