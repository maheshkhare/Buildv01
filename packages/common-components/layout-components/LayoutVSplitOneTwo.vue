<template>
  <div class="h-full grid grid-rows-3 grid-flow-col flex">
    <div
      class="row-span-1 flex flex-1"
      :class="{ 'shadow-md': !disableDivider }"
    >
      <slot name="topContent"></slot>
    </div>
    <div class="row-span-2 flex flex-1">
      <slot name="bottomContent"></slot>
    </div>
  </div>
</template>

<script>
  import 'CSS/tailwind.css'
  export default {
    name: 'LayoutVSplitOneTwo',
    props: {
      disableDivider: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
