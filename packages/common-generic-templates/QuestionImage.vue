<template>
  <div class="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto relative">
    <div class="relative" style="aspect-ratio: 725 / 515; min-height: 180px;">
      <img
        :src="getImgUrl(image)"
        alt="Question Visual"
        class="object-contain rounded shadow-md border border-gray-300 w-full h-full"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: String,
    getImgUrl: Function
  }
}
</script>
