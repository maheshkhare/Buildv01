import Sem1 from 'Lessons/Sem1/Sem1'
import { withKnobs, select } from '@storybook/addon-knobs'
import 'CSS/tailwind.css'

export default {
  title: './Lessons/Sem1',
  component: Sem1,
  decorators: [],
  parameters: {
  componentSubtitle: `Classifying Concepts`
  }
}

export const Instruction = () => ({
  components: { Sem1 },
  template: `<div style="height: 100vh">
      <Sem1 :exercise="0" mode="instruction">

      </Sem1>
  </div>
  `
})
export const Practice = () => ({
  components: { Sem1 },
  props: {
    exercise: {
      default: select(
        'Exercise #',
        {
          1: 0,
          2: 1,
          3: 2,
        },
        0
      )
    },
  },
  template: `<div style="height: 100vh">
      <Sem1 :exercise="exercise" >

      </Sem1>
  </div>
  `
})

Instruction.story = {
  name: 'Instruction',
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
