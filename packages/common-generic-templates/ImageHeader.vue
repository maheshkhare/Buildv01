<template>
  <div v-if="imageName" class="md:shrink-0 justify-center ml-auto mr-auto mt-1 shadow-lg">
    <div v-if="!isSpecial" class="border border-black text-center" :style="outerStyle">
      <img :src="getImgUrl(imageName)" :style="innerStyle" />
    </div>
    <div v-else class="bg-blue-100 w-48 p-2 border border-black rounded flex justify-center items-center overflow-hidden">
      <img :src="getImgUrl(imageName)" class="w-full h-full object-cover" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageName: String,
    fileName: String
  },
  computed: {
    isSpecial() {
      return this.fileName === 'EFU-I' || this.fileName === 'CFT-P';
    },
     outerStyle() {
      if (this.fileName === 'CMC-PK') {
        return "width:160px; height:165px;";
      }
      return "width:180px; height:75px;";
    },
    innerStyle() {
      if (this.fileName === 'CMC-PK') {
        return "width:160px; height:160px;";
      }
      return "width:220px; height:65px;";
    }
  },
  methods: {
    getImgUrl(name) {
  const fileName = sessionStorage.getItem('jsonFile') || 'lessonCFS-I';
  const images = require.context('../assets/graphics/', true, /\.png$/);
  try {
    return images(`./${fileName}/${name}.png`);
  } catch {
    return require('../assets/graphics/not_found.png');
  }
}

  }
}
</script>
