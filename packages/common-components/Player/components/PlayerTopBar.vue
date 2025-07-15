<template>
  <div class="flex flex-row flex-no-wrap justify-between p-4 bg-primary">
    <div
      class="flex flex-row flex-wrap justify-start flex-grow flex-shrink space-x-3"
    >
      <div class="flex-grow-0 text-3xl text-dark">{{ title }}</div>
      <div class="flex-grow-0 text-3xl text-base">{{ subtitle }}</div>
    </div>
    <!-- Timer Slot -->
    <div class="flex-grow flex-shrink-0"></div>
    <div class="flex-grow-0 flex-shrink-0">
      <SVGIconHamburger class="h-10"></SVGIconHamburger>
    </div>
  </div>
</template>

<script>
  import 'CSS/tailwind.css'
  import SVGIconHamburger from 'Components/icons-svg/SVGIconHamburger'
  export default {
    name: 'PlayerTopBar',
    components: { SVGIconHamburger },
    props: {
      title: {
        type: String,
        default: `Module Title`
      },
      subtitle: {
        type: String,
        default: `Practice Title`
      }
    }
  }
</script>

<style scoped></style>
