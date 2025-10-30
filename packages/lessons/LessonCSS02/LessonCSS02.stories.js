import LessonCSS02 from 'Lessons/LessonCSS02/LessonCSS02'
import { withKnobs, select } from '@storybook/addon-knobs'
import 'CSS/tailwind.css'

export default {
  title: './Lessons/CSS-L02',
  component: LessonCSS02,
  decorators: [],
  parameters: {
    componentSubtitle: `Moving the elevator one`
  }
}

export const Instruction = () => ({
  components: { LessonCSS02 },
  props: {
    instruction: {
      default: select(
        'Instruction',
        {
          1: 1,
          2: 2
        },
        1
      )
    }
  },
  template: `<div style="height: 100vh">
    <LessonCSS02 mode="instruction" :instruction="instruction">

      </LessonCSS02>
  </div>
  `
})
export const Practice = () => ({
  components: { LessonCSS02 },
  props: {
    exercise: {
      default: select(
        'Exercise #',
        {
          1: 1,
          2: 2
        },
        1
      )
    }
  },
  template: `<div style="height: 100vh">
      <LessonCSS02 :exercise="exercise">

      </LessonCSS02>
  </div>
  `
})

Instruction.story = {
  name: 'Instruction',
  decorators: [withKnobs],
  parameters: {
    docs: {
      storyDescription: ``
    }
  }
}

Practice.story = {
  name: 'Practice',
  decorators: [withKnobs],
  parameters: {
    docs: {
      storyDescription: ``
    }
  }
}
