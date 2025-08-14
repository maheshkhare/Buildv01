<template>
  <div
    class="w-full p-6 border border-gray-300 rounded-lg bg-white leading-relaxed text-lg text-gray-800"
    style="white-space: pre-wrap; word-wrap: break-word; line-height: 1.8; letter-spacing: 0.02em;"
  >
    <img
      :src="getImgUrlByFileName(paragraphText)"
      style="width: 100%; height: 100%; object-fit: cover;"
    />
  </div>
</template>

<script>
export default {
  props: {
    paragraphText: String,
    getImgUrlByFileName: Function
  }
}
</script>
