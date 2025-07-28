<template>
<div class="flex-container">
    <div class="grid grid-cols-1 -ml-10" style="border:0px; width: 100%; ">

        <div v-if="ImageNames" class="md:shrink-0 justify-center ml-auto mr-auto mt-1 shadow-lg">
            <div v-if="file_Name != 'EFU-I'  && file_Name != 'CFT'" style="width:180px; height:75px;text-align:center;border: 1px solid black;">
                <img :src="getImgUrl(ImageNames)" style="width:220px; height:65px;" />
            </div>
            <div v-if="file_Name == 'EFU-I' || file_Name == 'CFT'" class="bg-blue-100 w-48 text-black-700 font-semibold p-2 border border-black rounded flex justify-center items-center overflow-hidden" style="display: flex; justify-content: center; align-items: center; border: 1px solid black; overflow: hidden;">
                   <img :src="getImgUrl(ImageNames)" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>

        </div>

        <div class="tracking-wide text-sm text-indigo-500 font-semibold text-lg mt-5">
            <center>{{ instructionText }}</center>
        </div>

        <!-- Conditionally render matching set if imageSet exists -->
        <!-- ✅ IF file_Name == 'EFU-I' use multi-cols -->
<div
  v-if="file_Name == 'EFU-I'"
  class="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4 ml-auto mr-auto"
>
  <SVGImageButton
    v-for="(word, index) in commonNumArray.slice(0, 10)"
    :key="index"
    :identifier="index"
    :class="{
      'bg-blue-600 border-blue-400 shadow-md': word.state === 'selected',
      'bg-blue-600 border-blue-600 shadow-md': word.state === 'missed',
      'bg-blue-600 border-blue-400 shadow-md': word.state === 'correct',
      'bg-blue-600 border-blue-600 shadow-md': word.state === 'incorrect',
      'bg-white-0': word.state === 'unselected'
    }"
    style="border: none; padding: 5px;"
  >
    <button
      v-on:click="WordsAnswer(word.Answer, word.index)"
      class="bg-blue-100 w-48 hover:bg-yellow-500 text-black-700 font-semibold p-2 border border-black shadow-lg rounded flex justify-center items-center overflow-hidden"
      style="aspect-ratio: 1 / 1;"
    >
      <img
        :src="getImgUrl(word.Question)"
        class="w-full h-full object-cover"
      />
    </button>
  </SVGImageButton>
</div>

<!-- ✅ ELSE: normal -->
<div
  v-else
  class="grid grid-cols-2 md:grid-cols-2 sm:flex mt-4 ml-auto mr-auto"
>
  <SVGImageButton
    v-for="(word, index) in commonNumArray.slice(0, 10)"
    :key="index"
    :identifier="index"
    :class="{
      'bg-blue-600 border-blue-400 shadow-md': word.state === 'selected',
      'bg-blue-600 border-blue-600 shadow-md': word.state === 'missed',
      'bg-blue-600 border-blue-400 shadow-md': word.state === 'correct',
      'bg-blue-600 border-blue-600 shadow-md': word.state === 'incorrect',
      'bg-white-0': word.state === 'unselected'
    }"
    style="border: none; padding: 5px;"
  >
    <button
      v-on:click="WordsAnswer(word.Answer, word.index)"
      class="bg-blue-100 w-47 hover:bg-yellow-500 text-black-700 font-semibold py-2 px-2 border border-black shadow-lg rounded"
    >
      <img
        :src="getImgUrl(word.Question)"
        style="width: 165px; height: 49px;"
      />
    </button>
  </SVGImageButton>
</div>


        <div class="grid grid-rows-0 grid-flow-col mt-5" v-show="AnswerCheckShow">
            <div align="center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 181 90" height="50" width="80" filter="drop-shadow(0 0 4px gray)">
                    <path d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z" stroke="#000" stroke-width="2" fill="#0369a1" class="submit-selections" v-on:click="AnswerCheck()" />
                </svg>
            </div>
        </div>

        <div class="grid grid-rows-0 grid-flow-col" v-show="NextQuestionShow">
            <div align="center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 181 90" height="50" width="80" filter="drop-shadow(0 0 4px gray)">
                    <path d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z" stroke="#000" stroke-width="2" fill="#0369a1" class="submit-selections" v-on:click="NextQuestion()" />
                </svg>
            </div>
        </div>

       <!-- FINAL REPLACEMENT for your PREVIOUS ARROW -->
<div class="grid grid-rows-0 grid-flow-col mt-5">
  <div v-if="counter > 0">
    <div align="center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 181 90"
        height="50"
        width="80"
        filter="drop-shadow(0 0 4px gray)"
        style="transform: scaleX(-1); cursor: pointer;"
        @click="PreviousQuestion()"
      >
        <path
          d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z"
          stroke="#000"
          stroke-width="2"
          fill="#9ca3af"
          class="submit-selections"
        />
      </svg>
    </div>
  </div>
</div>
        <div class="grid grid-rows-0 grid-flow-col ml-auto mr-auto mt-5" style="width:auto;">
            <p class="font-bold ml-auto mr-auto">Question - <span class="text-indigo-700">{{ counter + 1}}</span> of <span class="text-indigo-700">{{ Total_Questions }}</span></p>
        </div>

    </div>
</div>
</template>

<script>
import 'CSS/tailwind.css'
import SVGShape from 'Components/SVGShape'
import SVGImageButton from 'Components/SVGImageButton'
export default {
    name: 'SectionSem2Top',
    components: {
        SVGImageButton,
        SVGShape
    },
    props: {
        commonNumArray: Array,
        AnswerCheckShow: Boolean,
        NextQuestionShow: Boolean,
        Total_Questions: String,
        Questions_attempted: String,
        ImageNames: String,
        instructionText: String,
        counter: Number,
        imageSet: Array // new prop for matching set
    },
    data() {
        return {
            selected: [],
            matched: [],
            file_Name: sessionStorage.getItem('jsonFile') || 'lessonCFS-I'
        };
    },

    mounted() {
        console.log("📘 instructionText received in SectionCFSI1WBMTop:", this.instructionText);
    },

    methods: {
        WordsAnswer(Answer, index) {
            this.$emit('WordsAnswer', Answer, index);
        },

        AnswerCheck() {
            this.$emit('AnswerCheck');
        },
        NextQuestion(index) {
            this.$emit('NextQuestion', index);
        },
        PreviousQuestion() {
            this.$emit('PreviousQuestion');
        },
        WordsValue(index) {
            this.$emit('WordsValue', index);
        },
       getImgUrl(ImgName) {
  console.log("DEBUG ImgName:", ImgName);
  const fileName = sessionStorage.getItem('jsonFile') || 'lessonCFS-I';
  console.log("DEBUG fileName:", fileName);
  const images = require.context('../assets/graphics/', true, /\.png$/);
  const path = `./${fileName}/${ImgName}.png`;
  console.log("Trying to load:", path);
  return images(path);
}

    }
};
</script>

<style>
.submit-selections svg {
    transition: all 500ms;
}

.submit-selections.clicked svg {
    @apply transform rotate-90 scale-95;
    transition: all 500ms;
    filter: none;
}

.flex-container {
    display: flex;
    justify-content: center;
    margin: auto;
}
</style>
