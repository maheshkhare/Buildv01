<!--without xmlns line, preserveAspectRatio throws warning, with it, all v-if and @click throw warnings, so, supressing-->
<!--suppress HtmlUnknownAttribute -->
<template>
  <div class="outer-wrap h-full w-full flex items-center justify-center">
    <div class="shape-container" :style="containerStyle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="computedViewBox"
        filter="drop-shadow(0 0 5px grey)"
        height="100%"
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        :class="{
          transform: rotate,
          'rotate-90': rotate
        }"
      >
        <ellipse
          v-if="shape === 'circle'"
          :cx="computedMeasures.horizontalCenter"
          :cy="computedMeasures.verticalCenter"
          :rx="computedMeasures.horizontalCenter"
          :ry="computedMeasures.verticalCenter"
          :style="computedStyle"
          @click="emitClick()"
        ></ellipse>
        <rect
          v-if="shape === 'square'"
          :width="computedMeasures.width"
          :height="computedMeasures.height"
          :style="computedStyle"
          x="0"
          y="0"
          @click="emitClick()"
        ></rect>
        <polygon
          v-if="shape === 'triangle'"
          :points="trianglePoints"
          :style="computedStyle"
          @click="emitClick()"
        ></polygon>
        <polygon
          v-if="shape === 'diamond'"
          :points="diamondPoints"
          :style="computedStyle"
          @click="emitClick()"
        ></polygon>
        <polygon
          v-if="shape === 'hexagon'"
          :points="hexagonPoints"
          :style="computedStyle"
          @click="emitClick()"
        ></polygon>
      </svg>
    </div>
  </div>
</template>

<script>
  /**
   * SVG Shape Generator Component capable of generating Circle, Square, Triangle, Hexagon and Diamond basic shapes.
   * All props have default values and no props are required.
   * Shapes generated can be as simple or as complex as needed by overriding prop defaults.
   * Default shape is a medium black circle with no border.
   * Adjust this by overriding a single prop, or completely define a custom shape.
   * 'width' accepts 'normal', 'wide', and 'narrow' values. 'height' accepts 'normal', 'tall', and 'short' properties.
   * Combine width and height property values with circle and square shapes to create various rectangles and ovals.
   * Hexagon shape is not effected by width/height properties.
   * Create a shape outline with translucent fill by setting prop 'opacity' to 0, and 'borderColor' to a desired color to make border visible.
   * 5 Basic sizes offered via 'size' prop.
   * 'm' (medium) is default with larger sizes l and xl, smaller sizes s and xs
   * Sizes are relative to the parent element the Shape component is placed within.
   * Opacity for both fill 'opacity' and border 'borderOpacity' accept numbers between 0 and 1
   * 'borderWeight' number values are rem, not pixels.
   * Has onClick handler to emit event and include shape data for {size, shape, color, width, height}
   */
  import 'CSS/tailwind.css'
  export default {
    name: 'Shape',
    props: {
      shape: {
        type: String,
        default: 'circle',
        validator: (value) => {
          return [
            'circle',
            'square',
            'triangle',
            'hexagon',
            'diamond'
          ].includes(value)
        }
      },
      color: {
        type: String,
        default: '#272727'
      },
      opacity: {
        type: [Number, String],
        default: 1
      },
      size: {
        type: String,
        default: 'm',
        validator: (value) => {
          return ['xs', 's', 'm', 'l', 'xl'].includes(value)
        }
      },
      height: {
        type: String,
        default: 'normal',
        validator: (value) => {
          return ['tall', 'normal', 'short'].includes(value)
        }
      },
      width: {
        type: String,
        default: 'normal',
        validator: (value) => {
          return ['wide', 'normal', 'narrow'].includes(value)
        }
      },
      borderColor: {
        type: String,
        default: 'none'
      },
      borderOpacity: {
        type: [Number, String],
        default: 1
      },
      borderWeight: {
        type: [Number, String],
        default: 1
      },
      rotate: {
        type: Boolean,
        default: false
      }
    },
    data: () => {
      return {}
    },
    computed: {
      baseSize: function () {
        let bases = {
          xs: 500,
          s: 750,
          m: 1000,
          l: 1500,
          xl: 2000
        }
        return bases[this.size]
      },
      computedMeasures: function () {
        let measures = {}
        measures.width =
          this.width === 'wide'
            ? 1.5 * this.baseSize
            : this.width === 'narrow'
            ? 0.5 * this.baseSize
            : this.baseSize
        measures.horizontalCenter = 0.5 * measures.width

        measures.height =
          this.height === 'tall'
            ? 1.5 * this.baseSize
            : this.height === 'short'
            ? 0.5 * this.baseSize
            : this.baseSize
        measures.verticalCenter = 0.5 * measures.height
        return measures
      },
      trianglePoints: function () {
        return `0,${this.computedMeasures.height} ${this.computedMeasures.horizontalCenter},0 ${this.computedMeasures.width},${this.computedMeasures.height}`
      },
      diamondPoints: function () {
        return `${this.computedMeasures.horizontalCenter},0
           ${this.computedMeasures.width},${this.computedMeasures.verticalCenter}
           ${this.computedMeasures.horizontalCenter},${this.computedMeasures.height}
           0,${this.computedMeasures.verticalCenter}`
      },
      hexagonPoints: function () {
        return `${0.25 * this.baseSize},0 ${0.75 * this.baseSize},0 ${
          this.baseSize
        },${0.5 * this.baseSize} ${0.75 * this.baseSize},${this.baseSize} ${
          0.25 * this.baseSize
        },${this.baseSize} 0,${0.5 * this.baseSize}`
      },
      computedStyle: function () {
        let fill =
          this.color !== 'none'
            ? this.opacity < 1
              ? `fill: ${this.color}; fill-opacity: ${this.opacity};`
              : `fill: ${this.color};`
            : undefined
        let border =
          this.borderColor !== 'none'
            ? this.borderOpacity < 1
              ? `stroke: ${this.borderColor}; stroke-width: ${this.borderWeight}rem; stroke-opacity: ${this.borderOpacity}`
              : `stroke: ${this.borderColor}; stroke-width: ${this.borderWeight}rem;`
            : undefined
        return fill
          ? fill && border
            ? `${fill} ${border}`
            : fill
          : border
          ? border
          : ``
      },
      computedViewBox: function () {
        if (this.shape === 'hexagon')
          return `0 0 ${this.baseSize} ${this.baseSize}`
        return `0 0 ${this.computedMeasures.width} ${this.computedMeasures.height}`
      },
      containerStyle: function () {
        let baseSizes = {
          xs: 20,
          s: 40,
          m: 60,
          l: 80,
          xl: 100
        }
        let base = baseSizes[this.size]
        let modifiers = {
          short: 0.33,
          normal: 0.66,
          tall: 0.99,
          narrow: 0.33,
          wide: 0.99
        }
        return this.shape !== 'hexagon'
          ? `width: ${base * modifiers[this.width]}%; height: ${
              base * modifiers[this.height]
            }%`
          : `width: ${base * modifiers['normal']}%; height: ${
              base * modifiers['normal']
            }%`
      }
    },
    methods: {
      emitClick() {
        this.$emit('shapeClick', {
          shape: this.shape,
          color: this.color,
          size: this.size,
          width: this.width,
          height: this.height,
          opacity: this.opacity
        })
      }
    }
  }
</script>

<style>
  svg {
    box-sizing: border-box;
    overflow: visible;
  }
  .shape-container {
    @apply flex-none;
    transition: all 500ms;
  }

  ellipse,
  rect,
  polygon {
    transition: all 500ms;
  }
</style>
