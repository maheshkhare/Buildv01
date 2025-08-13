<template>
  <div :class="containerClass">
    <SVGImageButton
      v-for="(word, index) in items.slice(0, 10)"
      :key="index"
      :identifier="index"
      :class="getButtonClass(word.state)"
      style="border: none; padding: 5px;"
    >
      <button
        @click="onAnswer(word.Answer, word.index)"
        :class="buttonClass"
        :style="buttonStyle"
      >
        <img :src="getImgUrl(word.Question)" :class="imageClass" :style="imageStyle" />
      </button>
    </SVGImageButton>
  </div>
</template>

<script>
export default {
  name: "AnswerOptionsGrid",
  props: {
    items: { type: Array, required: true },
    mode: { type: String, default: "normal" }, // 'EFU-I' or 'normal'
    onAnswer: { type: Function, required: true },
    getImgUrl: { type: Function, required: true }
  },
  computed: {
    containerClass() {
      return this.mode === "EFU-I"
        ? "grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4 ml-auto mr-auto"
        : "grid grid-cols-2 md:grid-cols-2 sm:flex mt-4 ml-auto mr-auto";
    },
    buttonClass() {
      return this.mode === "EFU-I"
        ? "bg-blue-100 w-48 hover:bg-yellow-500 text-black-700 font-semibold p-2 border border-black shadow-lg rounded flex justify-center items-center overflow-hidden"
        : "bg-blue-100 w-47 hover:bg-yellow-500 text-black-700 font-semibold py-2 px-2 border border-black shadow-lg rounded";
    },
    buttonStyle() {
      return this.mode === "EFU-I" ? "aspect-ratio: 1 / 1;" : "";
    },
    imageClass() {
      return this.mode === "EFU-I" ? "w-full h-full object-cover" : "";
    },
    imageStyle() {
      return this.mode === "EFU-I" ? "" : "width: 165px; height: 49px;";
    }
  },
  methods: {
    getButtonClass(state) {
      return {
        "bg-blue-600 border-blue-400 shadow-md": state === "selected",
        "bg-blue-600 border-blue-600 shadow-md": state === "missed" || state === "incorrect",
        "bg-blue-600 border-blue-400 shadow-md": state === "correct",
        "bg-white-0": state === "unselected"
      };
    }
  }
};
</script>
