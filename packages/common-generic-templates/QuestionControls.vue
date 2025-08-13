<template>
  <div>
    <!-- Previous Button, only visible if counter > 0 -->
    <div class="grid grid-rows-0 grid-flow-col mt-5" v-if="counter > 0">
      <div align="center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 181 90"
          height="50"
          width="80"
          filter="drop-shadow(0 0 4px gray)"
          style="transform: scaleX(-1); cursor: pointer;"
          @click="$emit('previous')"
        >
          <path
            d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z"
            stroke="#000"
            stroke-width="2"
            fill="#9ca3af"
            class="submit-selections"
          />
        </svg>
      </div>
    </div>

    <!-- Question Counter -->
    <div class="grid grid-rows-0 grid-flow-col ml-auto mr-auto mt-5" style="width:auto;">
      <p class="font-bold ml-auto mr-auto">
        Question -
        <span class="text-indigo-700">{{ counter + 1 }}</span> of
        <span class="text-indigo-700">{{ totalQuestions }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionControls',
  props: {
    counter: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: [Number, String],
      required: true
    }
  }
};
</script>

<style scoped>
.submit-selections {
  transition: all 500ms;
}
.submit-selections:hover {
  filter: brightness(1.1);
  cursor: pointer;
}
</style>
