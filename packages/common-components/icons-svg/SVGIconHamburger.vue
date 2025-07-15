<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    :stroke="stroke"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
    :viewBox="viewBox"
  >
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
</template>

<script>
  import baseMixin from 'Scripts/mixinBaseIcon'
  export default {
    name: 'SVGIconHamburger',
    mixins: [baseMixin]
  }
</script>
