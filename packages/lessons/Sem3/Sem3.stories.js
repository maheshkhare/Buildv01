import Sem3 from 'Lessons/Sem3/Sem3'
import { withKnobs, select } from '@storybook/addon-knobs'
import 'CSS/tailwind.css'

export default {
  title: './Lessons/Sem3',
  component: Sem3,
  decorators: [],
  parameters: {
    componentSubtitle: `Aiming Your Eyes`
  }
}

export const Instruction = () => ({
  components: { Sem3 },
  props: {
    instruction: {
      default: select(
        'Instruction',
        {
          1: 1
        },
        1
      )
    }
  },
  template: `<div style="height: 100vh">
    <Sem3 mode="instruction" :instruction="instruction">

      </Sem3>
  </div>
  `
})
export const Practice = () => ({
  components: { Sem3 },
  props: {
    exercise: {
      default: select(
        'Exercise #',
        {
          1: 0,
          2: 1,
          3: 2
          
        },
        0
      )
    },
  },
  template: `<div style="height: 100vh">
       <Sem3 :exercise="exercise">

      </Sem3>
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



