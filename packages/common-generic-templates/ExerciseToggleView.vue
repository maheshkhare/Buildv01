<template>
  <div class="w-full flex flex-col items-center">
    <button
      class="self-start mb-4 ml-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
      @click="$emit('toggle')"
    >
      {{ show ? 'Hide Exercise' : 'Show Exercise' }}
    </button>

    <div v-if="show" class="w-full flex justify-center mt-4">
      <div v-if="fileName === 'CST-II'" class="w-full flex justify-center">
        <img
          :src="getImgUrlByFileName(paragraphText)"
          class="rounded shadow"
          style="max-width: 700px; width: 100%; height: auto; object-fit: contain;"
        />
      </div>
      <div v-else>
        {{ paragraphText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    fileName: String,
    paragraphText: String,
    getImgUrlByFileName: Function
  }
}
</script>
