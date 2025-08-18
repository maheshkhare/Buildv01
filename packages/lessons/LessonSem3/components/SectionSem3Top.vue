<template>
  <div class="flex-container">
    <div class="grid grid-cols-1 w-full">
      <!-- Question Heading with Image -->
      <div class="tracking-wide text-lg text-indigo-500 font-semibold mx-auto -mt-6">
        <SVGImageButton
          v-for="(word, index) in commonNumArray.slice(0, 1)"
          :key="index"
          :identifier="index"
          :class="{ 'bg-white-0': word.state === 'unselected' }"
          style="border: none;"
        >
          <div class="text-center font-bold text-lg">
            {{ word.Question }}
          </div>
          <div class="grid grid-rows-1 ml-1">
            <div class="text-center border-none">
              <img
                v-if="ImageNames1 && getImgUrl1(ImageNames1)"
                :src="getImgUrl1(ImageNames1)"
                alt="Question Image"
                class="mx-auto"
                style="max-width: 400px; height: auto;"
              />
              <div v-else class="text-center text-gray-400 italic mt-2">
               <!-- No image available -->
              </div>
            </div>
          </div>
        </SVGImageButton>
      </div>

      <!-- Main Content Area -->
      <div class="w-full bg-white rounded-xl overflow-hidden p-2 mt-2 flex justify-center">
        <div class="md:flex sm:flex">
          <!-- CMS-II Four Image Layout -->
          <div v-if="isCMS2" class="grid grid-cols-2 gap-4 p-4 border rounded bg-white shadow-md">
            <div>
              <img v-if="ImageNames && getImgUrl(ImageNames)"
                   :src="getImgUrl(ImageNames)"
                   class="w-full h-auto object-contain border border-gray-300"/>
            </div>
            <div>
              <img v-if="ImageNames2 && getImgUrl(ImageNames2)"
                   :src="getImgUrl(ImageNames2)"
                   class="w-full h-auto object-contain border border-gray-300"/>
            </div>
            <div>
              <img v-if="ImageNames3 && getImgUrl(ImageNames3)"
                   :src="getImgUrl(ImageNames3)"
                   class="w-full h-auto object-contain border border-gray-300"/>
            </div>
            <div>
              <img v-if="ImageNames4 && getImgUrl(ImageNames4)"
                   :src="getImgUrl(ImageNames4)"
                   class="w-full h-auto object-contain border border-gray-300"/>
            </div>
          </div>
          <!-- Single Image Layout -->
          <div v-else class="md:shrink-0">
            <div class="w-full max-w-2xl text-center border border-black">
              <img
                v-if="ImageNames && getImgUrl(ImageNames)"
                :src="getImgUrl(ImageNames)"
                class="mx-auto"
                style="max-width: 100%; height: auto;"
              />
            </div>
          </div>

          <!-- Answer Buttons -->
          <div>
            <div :class="gridClass">
              <SVGImageButton
                v-for="(word, index) in commonNumArray"
                :key="index"
                :identifier="index"
                :class="{
                  'bg-blue-400 border-blue-400 shadow-md': word.state === 'selected',
                  'bg-blue-600 border-blue-600 shadow-md': ['missed', 'incorrect'].includes(word.state),
                  'bg-blue-600 border-blue-400 shadow-md': word.state === 'correct',
                  'bg-white-0': word.state === 'unselected' || word.state === 'base',
                }"
                style="padding: 5px; border: none; z-index: 10;"
              >
                <button
                  type="button"
                  class="bg-blue-100 font-semibold border border-black shadow-lg rounded whitespace-normal break-words text-center leading-relaxed"
                  :class="{
                    'ring-4 ring-green-500': viewingPrevious && word.state === 'selected',
                    'hover:bg-yellow-500': !viewingPrevious,
                  }"
                  :style="getOptionBoxStyle(word.Option)"
                  :disabled="viewingPrevious"
                  @click="!viewingPrevious && WordsAnswer(word.Answer, index)"
                >
                  <template v-if="isIconOption(word.Option)">
                    <span :style="getArrowStyle(word.Option)">
                      {{ getVisualArrow(word.Option) }}
                    </span>
                    <span :style="getRectangleStyle(word.Option)">
                      {{ getVisualRectangle(word.Option) }}
                    </span>
                  </template>
                  <template v-else>
                    {{ word.Option }}
                  </template>
                </button>
              </SVGImageButton>
            </div>

            <!-- Navigation Buttons and Question Number -->
            <div class="flex justify-center mt-5 space-x-3">
              <!-- Previous -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 181 90"
                height="50"
                width="70"
                filter="drop-shadow(0 0 4px gray)"
                :class="{ 'opacity-50 pointer-events-none': counter === 0, 'cursor-pointer': counter !== 0 }"
                @click="counter !== 0 && emitPreviousQuestion()"
              >
                <g transform="scale(-1, -1) translate(-181, -90)">
                  <path
                    d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z"
                    stroke="#000" stroke-width="2" fill="#0369a1"
                  />
                </g>
              </svg>
              <div v-if="AnswerCheckShow" class="ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 181 90"
                  height="50"
                  width="70"
                  filter="drop-shadow(0 0 4px gray)"
                  @click="AnswerCheck"
                  class="cursor-pointer"
                >
                  <path
                    d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z"
                    stroke="#000" stroke-width="2" fill="#0369a1"
                  />
                </svg>
              </div>
              <div v-if="NextQuestionShow" class="ml-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 181 90"
                  height="50"
                  width="70"
                  filter="drop-shadow(0 0 4px gray)"
                  @click="NextQuestion"
                  class="cursor-pointer"
                >
                  <path
                    d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z"
                    stroke="#000" stroke-width="2" fill="#0369a1"
                  />
                </svg>
              </div>
            </div>

            <p class="font-bold mt-3 text-center">
              Question <span class="text-indigo-700">{{ counter + 1 }}</span> of
              <span class="text-indigo-700">{{ Total_Questions }}</span>
            </p>

           
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'CSS/tailwind.css'
import SVGShape from 'Components/SVGShape'
import SVGImageButton from 'Components/SVGImageButton'

export default {
  name: 'SectionSem3Top',
  components: { SVGImageButton, SVGShape },
  props: {
    counter: Number,
    viewingPrevious: Boolean,
    acceptInput: Boolean,
    commonNumArray: Array,
    AnswerOption: Array,
    PrevQuestionShow: Boolean,
    AnswerCheckShow: Boolean,
    NextQuestionShow: Boolean,
    ProgressBar: Array,
    Total_Questions: String,
    Questions_attempted: String,
    AnswerArr: Array,
    ImageNames: String,
    ImageNames1: String,
    ImageNames2: String,
    ImageNames3: String,
    ImageNames4: String,
    QuestionText: String,
    isCMS2: Boolean,
  },
  data() {
    return {
      jsonFileName: sessionStorage.getItem('jsonFile') || 'lesson1',
    }
  },
  computed: {
    gridClass() {
      const count = this.commonNumArray?.length || 0
      if (count > 0) {
        if (count % 3 === 0) {
          return 'grid grid-cols-3 gap-4'
        } else if (count % 2 === 0) {
          return 'grid grid-cols-2 gap-4'
        } else {
          return 'grid grid-cols-1 gap-4'
        }
      }
      return 'grid grid-cols-1 gap-4'
    }
  },
  methods: {
    WordsAnswer(answer, index) {
      this.$emit('WordsAnswer', answer, index)
    },
    AnswerCheck() {
      this.$emit('AnswerCheck')
    },
    NextQuestion() {
      this.$emit('NextQuestion')
    },
    emitPreviousQuestion() {
      this.$emit('PreviousQuestion')
    },
    getImgUrl(name) {
      try {
        const folder = `./graphics${this.jsonFileName}/`
        const images = require.context('../assets/', true, /\.png$/)
        return images(`${folder}${name}.png`)
      } catch (e) {
        console.error(`Image not found: graphics${this.jsonFileName}/${name}.png`)
        return ''
      }
    },
    getImgUrl1(name) {
      try {
        const folder = `./graphics${this.jsonFileName}/`
        const images = require.context('../assets/', true, /\.png$/)
        return images(`${folder}${name}.png`)
      } catch (e) {
        // alert(`Image not found: graphics${this.jsonFileName}/${name}.png`)
        return ''
      }
    },
    // Detect arrow/rectangle icons in option
    isIconOption(option) {
      return /[➚⇗⮕↗➤➔█▌▏]/.test(option)
    },
    getOptionBoxStyle(option) {
      if (this.isIconOption(option)) {
        // Old fixed size for icon options
        return {
          width: '130px',
          minWidth: '130px',
          maxWidth: '130px',
          height: '110px',
          minHeight: '110px',
          maxHeight: '110px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }
      } else {
        // Dynamic size for text options
        return {
          minWidth: '130px',
          maxWidth: '350px',
          padding: '10px 16px',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          textAlign: 'center',
          display: 'inline-block',
          minHeight: '60px'
        }
      }
    },
    getVisualArrow(option) {
      if (!option) return ''
      const arrowMatch = option.match(/➚/g)
      return arrowMatch ? '➚' : ''
    },
    getArrowStyle(option) {
      const count = (option.match(/➚/g) || []).length
      if (count >= 3) return { fontSize: '4rem', fontWeight: 700, verticalAlign: 'middle', color: 'black' }
      if (count === 2) return { fontSize: '3rem', fontWeight: 600, verticalAlign: 'middle', color: 'black' }
      if (count === 1) return { fontSize: '1.8rem', fontWeight: 500, verticalAlign: 'middle', color: 'black' }
      return { color: 'black' }
    },
    getVisualRectangle(option) {
      if (!option) return ''
      if (option.includes('█')) return '█'
      if (option.includes('▌')) return '▌'
      if (option.includes('▏')) return '▏'
      return ''
    },
    getRectangleStyle(option) {
      if (option.includes('█')) {
        return { fontSize: '2.2rem', marginLeft: '0.2em', verticalAlign: 'middle', color: '#808080' }
      }
      if (option.includes('▌')) {
        return { fontSize: '1.6rem', marginLeft: '0.2em', verticalAlign: 'middle', color: '#808080' }
      }
      if (option.includes('▏')) {
        return { fontSize: '1.1rem', marginLeft: '0.2em', verticalAlign: 'middle', color: '#808080' }
      }
      return { color: '#808080' }
    },
  },
}
</script>

<style>
.flex-container {
  display: flex;
  justify-content: center;
  margin: auto;
}
.previously-selected {
  border: 2px solid #888;
  background-color: #eee;
  pointer-events: none;
  cursor: not-allowed;
}
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.pointer-events-none { pointer-events: none; }
.z-0 { z-index: 0; }
/* Additional styles for better text handling */
.option-button {
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}
</style>
