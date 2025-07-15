
<template>
  <div class="flex-container" >
    <div class="grid grid-cols-1" style="border:0px; width: 100%; ">
      
     <div class="tracking-wide text-lg text-indigo-500 font-semibold ml-auto mr-auto -mt-6">  
  <SVGImageButton
    v-for="(word, index) in commonNumArray.slice(0, 1)"
    :key="index"
    :identifier="index"
    :class="{ 'bg-white-0': word.state === 'unselected' }"
    style="border: none;"
  >
    <div class="w-full text-center">
      <span style="font-size: 18px; font-weight: bold;">{{ word.Question }}</span>
    </div>

    <!-- Image section (only show if valid image exists) -->
    <div class="grid grid-rows-1 ml-1">
      <div class="w-full text-center border-none">
        <img
          v-if="ImageNames1 && getImgUrl1(ImageNames1)"
          :src="getImgUrl1(ImageNames1)"
          alt="Question Image"
          class="mx-auto"
          style="max-width: 320px; height: auto;"
        />
        <div v-else class="text-center text-gray-400 italic mt-2">
          <!-- Optional: show placeholder text if no image -->
          No image available
        </div>
      </div>
    </div>

  </SVGImageButton>
</div>

      <div class=" w-full bg-white rounded-xl overflow-hidden p-2 mt-2" style="display: flex; justify-content: center;">
      <div class="md:flex sm:flex ">
          <div class="md:shrink-0" >
            <div class="w-full max-w-2xl" style=" text-align:center;border: 1px solid black;">

              <img :src="getImgUrl(ImageNames)" style=" ">
            </div> 
            
        </div>  
       
      <div>
        
        <div class="grid grid-cols-2 m-0" >
         <SVGImageButton
            v-for="(word, index) in commonNumArray.slice(0,4)"
            :key="index"
            :identifier="index"
             :class="{
            'bg-blue-400 border-blue-400 shadow-md': commonNumArray[word.index].state === 'selected',
            'bg-blue-600 border-blue-600 shadow-md': commonNumArray[word.index].state === 'missed',
            'bg-blue-600 border-blue-400 shadow-md':commonNumArray[word.index].state === 'correct',
            'bg-blue-600 border-blue-600 shadow-md': commonNumArray[word.index].state === 'incorrect',
            'bg-white-0 ': commonNumArray[word.index].state === 'unselected'}"
            style="padding:5px;border:none; z-index: 10;" >
            
           <button
  style="z-index: 10;"
  :class="[
    'bg-blue-100 w-40 font-semibold py-2 px-2 border border-black shadow-lg rounded',
    {
      'ring-4 ring-green-500': viewingPrevious && commonNumArray[word.index].state === 'selected',
      'hover:bg-yellow-500': !viewingPrevious
    }
  ]"
  :disabled="viewingPrevious"
  @click="!viewingPrevious && WordsAnswer(word.Answer, word.index)"
>
  <span style="text-align:center; padding: 0px;">{{ word.Option }}</span>
</button>

          </SVGImageButton>
        </div> 
        <div class="flex content-center justify-center mt-5 ml-auto mr-auto">
            <div class="">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 181 90" height="50" width="70" filter="drop-shadow(0 0 4px gray)" :class="{ 'opacity-50 pointer-events-none': counter === 0 }">
                  <g transform="scale(-1, -1) translate(-181, -90)">
                    <path
                      d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z"
                      stroke="#000"
                      stroke-width="2"
                      fill="#0369a1"
                      class="submit-selections"
                      v-on:click="emitPreviousQuestion()"
                    />
                  </g>
                </svg>
          
            </div> 
 


            <div class="ml-2" v-show="AnswerCheckShow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 181 90" height="50" width="70" filter="drop-shadow(0 0 4px gray)">
                  <path d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z" stroke="#000" stroke-width="2" fill="#0369a1"
                  class="submit-selections" v-on:click="AnswerCheck()"/>
              </svg>          
            </div>
            <div class="ml-2" v-show="NextQuestionShow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 181 90" height="50" width="70" filter="drop-shadow(0 0 4px gray)">
                    <path d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z" stroke="#000" stroke-width="2" fill="#0369a1"
                    class="submit-selections"  v-on:click="NextQuestion()"/>
                </svg>          
            </div>
            


          </div>

                    <p class="font-bold ml-auto mr-auto" style="margin-top: 10px; text-align: center;">
                      Question - <span class="text-indigo-700">Question {{ counter + 1 }}</span> of <span class="text-indigo-700">{{ Total_Questions }}</span>
                    </p>
      </div>    
      </div>  
        
        
      </div>
      <!-- <div class="grid grid-rows-0 grid-flow-col mt-3" v-show="AnswerCheckShow">
            <div align="center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 181 90" height="50" width="80" filter="drop-shadow(0 0 4px gray)">
                <path d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z" stroke="#000" stroke-width="2" fill="#0369a1"
                class="submit-selections" v-on:click="AnswerCheck()"/>
            </svg>          
          </div>
        </div>  -->
        <!-- <div class="grid grid-rows-0 grid-flow-col mt-3" v-show="NextQuestionShow">
          
            <div class="right-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 181 90" height="50" width="150" filter="drop-shadow(0 0 4px gray)">
                    <path d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z" stroke="#000" stroke-width="2" fill="#0369a1"
                    class="submit-selections" v-on:click="NextQuestion()"/>
                </svg>          
            </div>
          
        </div>  -->
       

        

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
      counter: {
    type: Number,
    required: true
  },
  viewingPrevious: {
    type: Boolean,
    default: false
  },
      acceptInput: {
        type: Boolean,
        required: true
      },
      commonNumArray: {
        type: Array,
        required: true
      },
       AnswerOption: {
        type: Array,
        required: true
      },
       PrevQuestionShow: {
          type: Boolean,
          default: false
        },
        AnswerCheckShow: {
        type: Boolean,
        required: true
        },
      NextQuestionShow: {
        type: Boolean,
        required: true
      },
        ProgressBar: {
        type: Array,
        required: true
      },
      Total_Questions:{
        type: String,
        required: true
      },
      Questions_attempted:{
        type: String,
        required: true
      },
        AnswerArr: {
        type: Array,
        required: true
      },
       ImageNames: {
        type: String,
        required: true
      },
      ImageNames1: {
        type: String,
        required: true
      },
       QuestionText: {
        type: String,
        required: true
      },
     },
   data() {
  return {
    
    jsonFileName: '' // to store the "CMU-I-2" part
   
  }
},
created() {
  const urlParams = new URLSearchParams(window.location.search)
  // this.jsonFileName = urlParams.get('lessonJSON') || 'default' // fallback if missing

  this.jsonFileName = sessionStorage.getItem('jsonFile') || 'lesson1';
},
    methods: {
      WordsAnswer(Answer,index) {
        this.$emit('WordsAnswer',Answer,index)
      },
    

       AnswerCheck() {
        this.$emit('AnswerCheck')
      },
      NextQuestion(index) {
        
            this.$emit('NextQuestion',index)
        },
       emitPreviousQuestion(index) {
  this.$emit('PreviousQuestion', index)
},
      WordsValue(index) {
            this.$emit('WordsValue',index)
        },
       getImgUrl(ImgName) {
  try {
    const folder = `./graphics${this.jsonFileName}/`
    const images = require.context('../assets/', true, /\.png$/)
    return images(`${folder}${ImgName}.png`)
  } catch (e) {
    console.error(`Image not found: graphics${this.jsonFileName}/${ImgName}.png`)
    return ''
  }
},
getImgUrl1(ImgName1) {
  try {
    const folder = `./graphics${this.jsonFileName}/`
    const images = require.context('../assets/', true, /\.png$/)
    return images(`${folder}${ImgName1}.png`)
  } catch (e) {
    alert(`Image not found: graphics${this.jsonFileName}/${ImgName1}.png`)
    return ''
  }
}

     
    }
  }
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

.previously-selected {
  border: 2px solid #888;
  background-color: #eee;
  pointer-events: none; /* Optional: disables clicking */
  cursor: not-allowed;
}

</style>
