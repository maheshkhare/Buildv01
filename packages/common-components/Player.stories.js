import Player from './Player'
import { select, withKnobs } from '@storybook/addon-knobs'
import 'CSS/tailwind.css'

// Component Level Decorators and Parameters
// noinspection JSUnusedLocalSymbols
export default {
  title: './Player',
  component: Player,
  decorators: [],
  parameters: {
    componentSubtitle: `Player Presentation-Wrapper Component`
  }
}

export const PlayerDemo = () => ({
  components: { Player },
  props: {
    lessonName: {
      default: select(
        'Lesson',
        {
          LessonCFC01: 'LessonCFC01',
          LessonCFC02: 'LessonCFC02',
          LessonCFS01: 'LessonCFS01',
          LessonCFS02: 'LessonCFS02',
          LessonCFS03: 'LessonCFS03',
          LessonCFS04: 'LessonCFS04',
		  LessonCMS01: 'LessonCMS01',
		  LessonCMS02: 'LessonCMS02',
          LessonCMR01: 'LessonCMR01',
    	  LessonCMR02: 'LessonCMR02',
          LessonMSUa01A: 'LessonMSUa01A',
          LessonMSUa01V: 'LessonMSUa01V',

          LessonCFU01: 'LessonCFU01',
          LessonCMC01: 'LessonCMC01',
          LessonCMS03: 'LessonCMS03',
          LessonCMS05: 'LessonCMS05',
          LessonCMS06: 'LessonCMS06',
          LessonCMS07: 'LessonCMS07',
          LessonCMS09: 'LessonCMS09',
          LessonCMS10: 'LessonCMS10',
          LessonCMU01: 'LessonCMU01',
          LessonCMU02: 'LessonCMU02',
          LessonCMU03: 'LessonCMU03',
          LessonCMU05: 'LessonCMU05',
          LessonCSR01: 'LessonCSR01',
          LessonCSR02: 'LessonCSR02',
          LessonCSR03: 'LessonCSR03',
          LessonCSR04: 'LessonCSR04',
          LessonEFC01: 'LessonEFC01',
          LessonESS01: 'LessonESS01',
          LessonMFSa01: 'LessonMFSa01',
          LessonMFU01: 'LessonMFU01',
          LessonMFU02: 'LessonMFU02',
          LessonMFU04: 'LessonMFU04',
          LessonMMI01: 'LessonMMI01',
          LessonMMR01: 'LessonMMR01',
          LessonMMUa01: 'LessonMMUa01',
          LessonMMUa02: 'LessonMMUa02',
          LessonMMUv02: 'LessonMMUv02',
          LessonMSS02: 'LessonMSS02',
          LessonMSSv01: 'LessonMSSv01',
          LessonMSSv02: 'LessonMSSv02',
          LessonMSSv05: 'LessonMSSv05',
          LessonMSUa01A: 'LessonMSUa01A',
          LessonMSUa02V: 'LessonMSUa02V',
          LessonVISIONL01: 'LessonVISIONL01',
          LessonVISIONL02: 'LessonVISIONL02'

        },
        'LessonCFC01'
      )
    },
    mode: {
      default: select(
        'Mode',
        { Instruction: 'instruction', Practice: 'practice' },
        'practice'
      )
    },
    exercise: {
      default: select('Exercise', { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5,6:6 }, 0)
    },
    set: {
      default: select('Set', { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5,6:6 }, 0)
    },
    lessonProgress: {
      default: select(
        'Question',
        {
          0: [],
          1: [1],
          2: [1, 1],
          3: [1, 1, 1],
          4: [1, 1, 1, 1],
          5: [1, 1, 1, 1, 1]
        },
        []
      )
    }
  },
  template: `<Player :lessonData="{lessonName: lessonName, mode: mode, exercise: exercise, set:set}" :playerData="{}" :lessonProgress="lessonProgress"></Player>`
})

PlayerDemo.story = {
  name: 'Player',
  decorators: [withKnobs],
  parameters: {
    docs: {
      storyDescription: ``
    }
  }
}
