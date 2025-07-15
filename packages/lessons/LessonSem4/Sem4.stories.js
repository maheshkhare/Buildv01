import Sem4 from 'Lessons/LessonSem4/Sem4'
import { withKnobs, select } from '@storybook/addon-knobs'
import 'CSS/tailwind.css'

export default {
  title: './Lessons/LessonSem4',
  component: Sem4,
  decorators: [],
  parameters: {
    componentSubtitle: `Aiming Your Eyes`
  }
}

export const Instruction = () => ({
  components: { Sem4 },
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
    <Sem4 mode="instruction" :instruction="instruction">

      </Sem4>
  </div>
  `
})
export const Practice = () => ({
  components: { Sem4 },
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
       <Sem4 :exercise="exercise">

      </Sem4>
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



