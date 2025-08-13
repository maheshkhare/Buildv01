<template>
  <div class="tracking-wide text-sm text-indigo-500 font-semibold text-lg mt-5">
    <center>{{ text }}</center>
  </div>
</template>

<script>
export default {
  name: 'InstructionText',
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>
