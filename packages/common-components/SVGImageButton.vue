<template>
  <div
    class="svg-button"
    :class="{
      clicked: clicked,
      selected: selected,
      correct:
        !disableCorrect &&
        comparison === identifier &&
        (showCorrect || selected),
      incorrect: !disableCorrect && selected && comparison !== identifier,
      'border-white': disableBorder
    }"
    @click="handleClick"
  >
    <slot></slot>
  </div>
</template>

<script>
  /**
   * Reusable container meant to hold an SVG image and be used as an answer selection button.
   * Pass an identifier string prop unique to the component that will be emitted back on click to identify what box was selected.
   * Pass a comparison string that will be compared to identifier to determine if this box held the correct answer.
   * Pass boolean showCorrect if desired to have box background turn green when id matches comparison, to indicate it was the correct answer to be chosen.
   * Component will pass through it's 'clicked' transition on click, then emit its identifier in click event. Parent component toggles the 'selected' state through passing of selected prop. This allows parent to control when box "un-selects"
   */
  import 'CSS/tailwind.css'
  export default {
    name: 'SVGImageButton',
    props: {
      identifier: {
        type: [String, Number],
        required: true
      },
      comparison: {
        type: String,
        default: ``
      },
      selected: {
        type: Boolean,
        default: false
      },
      showCorrect: {
        type: Boolean,
        default: false
      },
      disableBorder: {
        type: Boolean,
        default: false
      },
      disableCorrect: {
        type: Boolean,
        default: false
      },
      acceptInput: {
        type: Boolean,
        default: true
      }
    },
    data: () => {
      return {
        clicked: false
      }
    },
    methods: {
      handleClick: function () {
        if (this.acceptInput) {
          this.$data.clicked = true
          this.$data.clicked = ``
          this.$emit(
            'svgImageButtonClicked',
            this.identifier,
            this.identifier === this.comparison ? 1 : 0
          )
        }
      }
    }
  }
</script>

<style>
  .svg-button {
    @apply border-4 p-4 flex-1 flex items-center;
    transition: all 1000ms;
  }

  @media (hover: hover) and (pointer: fine) {
    .svg-button:hover {
      @apply border-4 border-blue-500;
    }
  }

  /*noinspection CssUnusedSymbol*/
  .svg-button.clicked {
    @apply border-4 bg-blue-200 border-blue-500;
  }

  .svg-button.clicked svg {
    @apply transform scale-95;
    transition: all 500ms;
    filter: none;
  }

  .svg-button svg {
    @apply flex-auto;
    transition: all 500ms;
  }
  /*noinspection CssUnusedSymbol*/
  .svg-button.selected {
    @apply border-4 border-blue-500;
  }
  /*noinspection CssUnusedSymbol*/
  .svg-button.selected.correct {
    @apply border-4 border-green-500 bg-green-200;
  }
  /*noinspection CssUnusedSymbol*/
  .svg-button.selected.incorrect {
    @apply border-4 border-red-500 bg-red-200;
  }
  /*noinspection CssUnusedSymbol*/
  .svg-button.correct {
    @apply bg-green-200 border-green-200;
  }
</style>
