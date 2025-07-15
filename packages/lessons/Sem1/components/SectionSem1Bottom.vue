<template>
  <div class="flex-container"> 
    <div v-show="showBottom" class="grid grid-cols-1 ml-auto mr-auto">
      <div class="grid grid-cols-1 md:grid-cols-1 md:shrink-0 sm:flex m-10 ml-auto">
        <div> 
          <div class="title1">{{ title1 }} </div>
          <div class="w-64 px-3 ml-auto" style="margin-left: 100px; margin-top: 15px">


            <SVGImageButton 
              style="margin-bottom: 5px; item-align: center; padding: 0px; width: 240px;"
              v-for="FirstColumnval in FirstColumn.slice(0, FirstRowCount)"
              :key="FirstColumnval.index"
              :identifier="FirstColumnval.index"
              :disable-correct="false"
              :accept-input="acceptInput"
            >
              <div
                style="text-align: center; width: 240px; height: 30px; font-size: 18px;"
                :class="{
                  'border-blue-400 shadow-md': FirstColumn[FirstColumnval.index].state === 'selected',

                  'bg-blue-200 border-blue-400 shadow-md': FirstColumn[FirstColumnval.index].state === 'correct',
                  'bg-blue-200 border-blue-600 shadow-md': FirstColumn[FirstColumnval.index].state === 'missed',
                  'bg-blue-200 border-blue-600 shadow-md': FirstColumn[FirstColumnval.index].state === 'incorrect',
                  'bg-white-0': FirstColumn[FirstColumnval.index].state === 'unselected',
                  'cursor-not-allowed opacity-75': !acceptInput,
                  clicked: clicked
                }"

                v-on:click="firstcolSelection(FirstColumnval.index)"
                class="border-blue-500"
              >
                {{ FirstColumnval.name }}
              </div> 
            </SVGImageButton> 
            
          </div>
        </div>

        <div>
          <div class="title2">{{ title2 }}</div>
          <div class="mr-10 px-3" style="margin-top: 15px">
            <SVGImageButton
              style="margin-bottom: 5px; item-align: center; padding: 0px; width: 240px;"
              v-for="SecondColumnVal in SecondColumn.slice(0, SecondRowCount)"
              :key="SecondColumnVal.index"
              :identifier="SecondColumnVal.index"
              :disable-correct="true"
              :accept-input="acceptInput"
              class="rounded-md"
            >
              <div
                style="text-align: center; width: 240px; height: 30px; font-size: 18px;"
                :class="{
                  'bg-blue-200 border-blue-400 shadow-md': SecondColumn[SecondColumnVal.index].state === 'selected',
                  'bg-blue-200 border-blue-400 shadow-md': SecondColumn[SecondColumnVal.index].state === 'correct',
                  'bg-blue-400 border-blue-600 shadow-md': SecondColumn[SecondColumnVal.index].state === 'missed',
                  'bg-blue-200 border-blue-600 shadow-md': SecondColumn[SecondColumnVal.index].state === 'incorrect',
                  'bg-white-0': SecondColumn[SecondColumnVal.index].state === 'unselected',
                  'cursor-not-allowed opacity-75': !acceptInput,
                  clicked: clicked
                }"
                v-on:click="secondColSelection(SecondColumnVal.index)"
                class="border-blue-500"
              >
                {{ SecondColumnVal.name }}
              </div>
            </SVGImageButton> 
          </div>
        </div>

        <div v-show="Listthird">
          <div class="title2">{{ title3 }}</div>
          <div class="w-1/3 px-3 mr-auto" style="margin-top: 15px">
            <SVGImageButton
              style="margin-bottom: 5px; item-align: center; padding: 0px; width: 140px;"
              v-for="ThirdColumnval in ThirdColumn.slice(0, ThirdRowCount)"
              :key="ThirdColumnval.index"
              :identifier="ThirdColumnval.index"
              :disable-correct="true"
              :accept-input="acceptInput"
              class="rounded-md"
            >
              <div
                style="text-align: center; border: 3px solid gray; display: inline-block; width: 280px; height: 40px; font-size: 18px;"
                :class="{
                  'border-blue-400 shadow-md': ThirdColumn[ThirdColumnval.index].state === 'selected',
                  'bg-green-200 border-green-400 shadow-md': ThirdColumn[ThirdColumnval.index].state === 'correct',
                  'bg-yellow-400 border-blue-600 shadow-md': ThirdColumn[ThirdColumnval.index].state === 'missed',
                  'bg-red-400 border-red-600 shadow-md': ThirdColumn[ThirdColumnval.index].state === 'incorrect',
                  'bg-white-0': ThirdColumn[ThirdColumnval.index].state === 'unselected',
                  'cursor-not-allowed opacity-75': !acceptInput
                }"
                v-on:click="thirdColSelection(ThirdColumnval.index)"
              >
                {{ ThirdColumnval.name }}
              </div>
            </SVGImageButton> 
          </div>
        </div>

        <div v-show="Listfourth">
          <div class="title4">{{ title4 }}</div>
          <div class="w-1/3 px-3 mr-auto" style="margin-top: 15px">
            <SVGImageButton
              style="margin-bottom: 5px; item-align: center; padding: 0px; width: 240px;"
              v-for="FourthColumnval in FourthColumn.slice(0, FourthRowCount)"
              :key="FourthColumnval.index"
              :identifier="FourthColumnval.index"
              :disable-correct="true"
              :accept-input="acceptInput"
              class="rounded-md"
            >
              <div
                style="text-align: center; border: 3px solid gray; display: inline-block; width: 280px; height: 40px; font-size: 18px;"
                class="submit-selections"
                :class="{
                  'border-blue-400 shadow-md': FourthColumn[FourthColumnval.index].state === 'selected',
                  'bg-green-600 border-green-600 shadow-md': FourthColumn[FourthColumnval.index].state === 'correct',
                  'bg-yellow-400 border-blue-600 shadow-md': FourthColumn[FourthColumnval.index].state === 'missed',
                  'bg-red-400 border-red-600 shadow-md': FourthColumn[FourthColumnval.index].state === 'incorrect',
                  'bg-white-0': FourthColumn[FourthColumnval.index].state === 'unselected',
                  'cursor-not-allowed opacity-75': !acceptInput
                }"
                v-on:click="fourthColSelection(FourthColumnval.index)"
              >
                {{ FourthColumnval.name }}
              </div>
            </SVGImageButton>
          </div>
        </div>
      </div>

<div class="flex justify-center items-center gap-8 my-4">
  <!-- Previous Button -->
  <svg
    v-if="showPreviousButton"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-330 50 70 90"
    height="50"
    width="60"
    filter="drop-shadow(0 0 4px gray)"
    transform="rotate(180)"
    class="cursor-pointer hover:opacity-80 transition-opacity"
    @click="ClickPreviousButton"
  >
    <path
      d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z"
      stroke="#000"
      stroke-width="2"
      fill="#0369a1"
    />
  </svg>

  <!-- Next Button -->
  <svg
    v-if="showNextButton"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-330 50 70 90"
    height="50"
    width="60"
    filter="drop-shadow(0 0 4px gray)"
    class="cursor-pointer hover:opacity-80 transition-opacity"
    @click="ClickNextButton"
  >
    <path
      d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z"
      stroke="#000"
      stroke-width="2"
      fill="#0369a1"
    />
  </svg>
</div>
    </div>
  </div>
</template>

<script>
import 'CSS/tailwind.css'
import SVGShape from 'Components/SVGShape'
import SVGImageButton from 'Components/SVGImageButton'
import { first } from 'lodash';

export default {
  name: ' SectionSem1Bottom',
  components: { SVGShape, SVGImageButton },
  
 props: {
  acceptInput: {
    type: Boolean,
    required: true
  },
 
  showNextButton: {
    type: Boolean,
    required: true
  },
  showPreviousButton: {
    type: Boolean,
    required: true
  },
  isReviewMode: {
    type: Boolean,
    default: false
  },
  Arrow_isShowing: {
    type: Boolean,
    required: true
  },
  
    FirstColumn: {
      type: Array,
      required: true
    },
    SecondColumn: {
      type: Array,
      required: true
    },
    ThirdColumn: {
      type: Array,
      required: true
    },
    FourthColumn: {
      type: Array,
      required: true
    },
    Listthird: {
      type: Boolean,
      default: false
    },
    Listfourth: {
      type: Boolean,
      default: false
    },
    title1: {
      type: String,
      required: true
    },
    title2: {
      type: String,
      required: true
    },
    title3: {
      type: String,
      required: true
    },
    title4: {
      type: String,
      required: true
    },
    Arrow_isShowing: {
      type: Boolean,
      required: true
    },
    FirstRowCount: {
      type: Number,
      required: true
    },
    SecondRowCount: {
      type: Number,
      required: true
    },
    ThirdRowCount: {
      type: Number,
      required: true
    },
    FourthRowCount: {
      type: Number,
      required: true
    },
    showPreviousButton: {
      type: Boolean,
      required: true
    },
    showBottom: {
      type: Boolean,
      required: false
    },
    showNextButton: {
      type: Boolean,
      required: true
    },
    isReviewMode: {
      type: Boolean,
      default: false
    },
 showNextButton: {
      type: Boolean,
      required: true
    },
    showPreviousButton: {
      type: Boolean,
      required: true
    },
    isReviewMode: {
      type: Boolean,
      default: false
    },
    Arrow_isShowing: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    clicked: false

     
  
  }),
mounted() {
  console.log('FirstColumn:', this.FirstColumn);
}
,

// mounted() {
//   // Loop through all values in FirstColumn
//   this.FirstColumn.forEach((item, index) => {
//     console.log(`Item ${index}:`, item);
//     alert(`Item ${index}:\nName: ${item.name}\nState: ${item.state}`);
//   });
// }
// ,
  
  methods: {

    
    firstcolSelection(index) {
      console.log('First Column Selection:', index);
      if (this.acceptInput) {
        this.$emit('OnClicked_FirstCol', index);
        
      }
    },
    secondColSelection(index) {
      if (this.acceptInput) {
        this.$emit('OnClicked_SecondCol', index);
      }
    },
    thirdColSelection(index) {
      if (this.acceptInput) {
        this.$emit('OnClicked_ThirdCol', index);
      }
    },
    fourthColSelection(index) {
      if (this.acceptInput) {
        this.$emit('OnClicked_FourthCol', index);
      }
    },
    ClickNextButton() {
      this.$emit('Click_NextButton');
    },
    ClickPreviousButton() {
      this.$emit('Click_PreviousButton');
    }
  }
}
</script>

<style scoped>
.title1 {
  text-align: center;
  margin-left: 120px;
  border: 3px solid #2cb9fa;
  display: inline-block;
  width: 220px;
  height: 35px;
  background-color: #2cb9fa;
  color: white;
  font-weight: bold;
}
.title2 {
  text-align: center;
  margin-left: 20px;
  border: 3px solid #2cb9fa;
  display: inline-block;
  width: 220px;
  height: 35px;
  background-color: #2cb9fa;
  color: white;
  font-weight: bold;
}
.title4 {
  text-align: center;
  border: 3px solid #2cb9fa;
  display: inline-block;
  width: 220px;
  height: 35px;
  background-color: #2cb9fa;
  color: white;
  font-weight: bold;
  margin-left: 16px;
}
.flex-container {
  display: flex;
  justify-content: center;
  margin: auto;
}
</style>