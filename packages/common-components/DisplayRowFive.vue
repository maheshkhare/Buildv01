<template>
  <div class="flex-1 flex">
    <div class="w-1/5 flex content-center"><slot name="slot1"></slot></div>
    <div class="w-1/5 flex content-center"><slot name="slot2"></slot></div>
    <div class="w-1/5 flex content-center"><slot name="slot3"></slot></div>
    <div class="w-1/5 flex content-center"><slot name="slot4"></slot></div>
    <div class="w-1/5 flex content-center"><slot name="slot5"></slot></div>
  </div>
</template>

<script>
  import 'CSS/tailwind.css'
  export default {
    name: 'DisplayRowFive'
  }
</script>
