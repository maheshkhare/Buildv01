import SVGShape from './SVGShape'
import {
  select,
  color,
  withKnobs,
  number,
  boolean
} from '@storybook/addon-knobs'
import 'CSS/tailwind.css'

// Component Level Decorators and Parameters
// noinspection JSUnusedLocalSymbols
export default {
  title: './Components/SVG Shape Generator',
  component: SVGShape,
  decorators: [
    (storyFn) => {
      return { template: `<div style="margin: 1rem"><story/></div>` }
    }
  ],
  parameters: {
    componentSubtitle: `Basic SVG Shape Generator Component`
  }
}

export const ShapeWithProps = () => ({
  components: { SVGShape },
  props: {
    shape: {
      default: select(
        'SVGShape',
        {
          Circle: 'circle',
          Square: 'square',
          Triangle: 'triangle',
          Hexagon: 'hexagon',
          Diamond: 'diamond'
        },
        'circle'
      )
    },
    color: {
      default: color('Color', '#272727')
    },
    opacity: {
      default: number('Opacity', 1, { range: true, min: 0, max: 1, step: 0.05 })
    },
    size: {
      default: select(
        'Size',
        {
          'Extra Small': 'xs',
          Small: 's',
          Medium: 'm',
          Large: 'l',
          'Extra Large': 'xl'
        },
        'm'
      )
    },
    width: {
      default: select(
        'Width',
        {
          Normal: 'normal',
          Wide: 'wide',
          Narrow: 'narrow'
        },
        'normal'
      )
    },
    height: {
      default: select(
        'Height',
        {
          Normal: 'normal',
          Tall: 'tall',
          Short: 'short'
        },
        'normal'
      )
    },
    borderColor: {
      default: color('Border Color', 'none')
    },
    borderWeight: {
      default: number('Border Weight (rem)', 1, {
        range: true,
        min: 0.5,
        max: 10,
        step: 0.5
      })
    },
    borderOpacity: {
      default: number('Border Opacity', 1, {
        range: true,
        min: 0,
        max: 1,
        step: 0.05
      })
    },
    rotate: {
      default: boolean('Rotate 90 Degrees', false)
    }
  },
  template: `<div style="height: 60vh;"><div class="flex content-center"><SVGShape :shape="shape" :color="color" :opacity="opacity" :size="size" :width="width" :height="height" :borderColor="borderColor" :borderWeight="borderWeight" :borderOpacity="borderOpacity" :rotate="rotate"></SVGShape></div></div>`
})

// Story Level Decorators and Parameters (though withKnobs still seems to end up component wide)
ShapeWithProps.story = {
  name: 'SVGShape',
  decorators: [withKnobs],
  parameters: {
    docs: {
      storyDescription: ``
    }
  }
}
