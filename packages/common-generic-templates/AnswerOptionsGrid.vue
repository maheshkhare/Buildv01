<template>
  <div :class="containerClass">
    <SVGImageButton
      v-for="(word, index) in items.slice(0, 40)"
      :key="index"
      :identifier="index"
      :class="getButtonClass(word.state)"
      style="border: none; padding: 5px;"
    >
      <button
        @click="!disableSelection && onAnswer(word.Answer, word.index)"
        :class="[buttonClass, getButtonClass(word.state), { 'cursor-not-allowed opacity-50': disableSelection }]"
        :disabled="disableSelection"
        :style="buttonStyle"
      >
        <!-- Show image if exists, otherwise show text -->
        <template v-if="hasImage(word.Question)">
          <img :src="getImgUrl(word.Question)" :class="imageClass" :style="imageStyle" />
        </template>
        <template v-else>
          <span class="text-lg font-semibold text-center">{{ word.Question }}</span>
        </template>
      </button>
    </SVGImageButton>
  </div>
</template>

<script>
export default {
  name: "AnswerOptionsGrid",
  props: {
    items: { type: Array, required: true },
    mode: { type: String, default: "normal" }, // 'EFU-I', 'CMR-I', etc.
    onAnswer: { type: Function, required: true },
    disableSelection: { type: Boolean, default: false }
  },

  watch: {
    items: {
      handler(newVal) {
        console.log("AnswerOptionsGrid - items received:", JSON.stringify(newVal, null, 2));
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {
    console.log("AnswerOptionsGrid mounted - initial items:", JSON.stringify(this.items, null, 2));
  },
  computed: {
   containerClass() {
  if (this.mode === "EFU-I") {
    return "grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4 ml-auto mr-auto";
  } else if (this.mode === "CMR-I") {
    // 👉 your custom centered style for CMR-I
    return "grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-2 mt-2 ml-auto mr-auto";
  } else {
    return "grid grid-cols-2 md:grid-cols-2 sm:flex mt-4 ml-auto mr-auto";
  }
},

    buttonClass() {
  if (this.mode === "EFU-I") {
    return "bg-blue-100 w-48 hover:bg-yellow-500 text-black-700 font-semibold p-2 border border-black shadow-lg rounded flex justify-center items-center overflow-hidden";
  } else if (this.mode === "CMR-I") {
    // 👉 Fixed size inside 20-column grid
    return "bg-blue-100 w-full h-16 hover:bg-yellow-500 text-black-700 font-semibold p-2 border border-black shadow-lg rounded flex justify-center items-center overflow-hidden";
  } else {
    return "bg-blue-100 w-47 hover:bg-yellow-500 text-black-700 font-semibold py-2 px-2 border border-black shadow-lg rounded";
  }
},
    buttonStyle() {
      return this.mode === "EFU-I" ? "aspect-ratio: 1 / 1;" : "";
    },
    imageClass() {
      return this.mode === "EFU-I" ? "w-full h-full object-cover" : "";
    },
    imageStyle() {
      if (this.mode === "EFU-I") {
        return "";
      } 
      else if (this.mode === "CMC-PK" || this.mode === "CFT-P" || this.mode === "CFC-I") {
        return "width: 165px; height: 165px;";
      } else {
        return "width: 165px; height: 49px;";
      }
    }
  },
  methods: {
    getButtonClass(state) {
      return {
        "bg-blue-600 border-blue-400 shadow-md": state === "selected",
        "bg-red-500 border-red-500 shadow-md": state === "incorrect",
        "bg-green-500 border-green-500 shadow-md": state === "correct",
        "bg-blue-100 border-black": state === "unselected"
      };
    },

    hasImage(ImgName) {
      const fileName = sessionStorage.getItem('jsonFile') || 'lessonCFS-I';
      const images = require.context('../assets/graphics/', true, /\.png$/);
      const path = `./${fileName}/${ImgName}.png`;
      try {
        images(path);
        return true;
      } catch {
        return false; // image does not exist
      }
    },

    getImgUrl(ImgName) {
      const fileName = sessionStorage.getItem('jsonFile') || 'lessonCFS-I';
      const images = require.context('../assets/graphics/', true, /\.png$/);
      const path = `./${fileName}/${ImgName}.png`;
      try {
        return images(path);
      } catch {
        return this.mode === "CMR-I"
          ? null
          : require('../assets/graphics/not_found.png');
      }
    }
  }
};
</script>
