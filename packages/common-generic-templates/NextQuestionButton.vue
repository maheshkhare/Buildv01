<template>
  <div class="grid grid-rows-0 grid-flow-col" v-show="visible">
    <div align="center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 181 90"
        height="50"
        width="80"
        filter="drop-shadow(0 0 4px gray)"
        @click="$emit('click')"
        style="cursor: pointer;"
      >
        <path
          d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z"
          stroke="#000"
          stroke-width="2"
          fill="#0369a1"
          class="submit-selections"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NextQuestionButton',
  props: {
    visible: {
      type: Boolean,
      default: true
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
