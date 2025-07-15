<template>
  <div class="h-full grid grid-rows-3 grid-flow-col flex">
    <div
      class="row-span-2 flex flex-auto"
      :class="{ 'shadow-md': !disableDivider }"
    >
      <slot name="topContent"></slot>
    </div>
    <div class="row-span-1 flex flex-auto">
      <slot name="bottomContent"></slot>
    </div>
  </div>
</template>

<script>
  import 'CSS/tailwind.css'
  export default {
    name: 'LayoutVSplitTwoOne',
    props: {
      disableDivider: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
