<template>
  <OneToThreeVertical :disable-divider="true">
    <template v-slot:topContent>
      <div class="w-full main-bg min-h-screen">
        <div class="w-full">
          <topHeader 
            :HeaderTop="HeaderTop" 
            :componentSubtitle="componentSubtitle" 
          />
        </div>

        <!-- Result Popup -->
        <resultPopup
          v-show="resultShow"
          :result-data="resultData"
          :activity_Status="activity_Status"
          :Time_elapsed="Time_elapsed"
          :Questions_attempted="Questions_attempted"
          :correct_Answers="correct_Answers"
          :incorrect_Answers="incorrect_Answers"
          :ResultHide="ResultHide"
          :ResultArrow="ResultArrow"
          @FinalResult="FinalResult"
        />

       


        <!-- Activity Components -->
        <div v-show="!resultShow">
        <ElevatorActivity
        v-if="jsonFileName === 'CSS-II' && questionArray.length"
        :question-data="questionArray"
        :current-index="counter"
        :total="Total_Questions"
        @answer-selected="handleElevatorAnswer"
        @next="counter++"
        @prev="counter--"
        @quiz-finished="showResultPopup"
        class="w-full"
      />
          
          <!-- CFU-P Activity -->
          <CFUPHandler
            v-if="jsonFileName === 'CFU-P' && questionArray.length"
            :questionData="questionArray"
            :currentIndex="counter"
            :total="Total_Questions"
            :mainImageSrc="mainImageSrc"
            :objectImageSrc="objectImageSrc"
            @next="counter++"
            @prev="counter--"
            @answer-selected="handleAnswer"
            @quiz-finished="showResultPopup"
            @save="onSave"
          />

          <!-- MSU-I Activity -->
          <TimeActivity
            v-if="jsonFileName === 'MSU-I' && questionArray.length"
            :questionData="questionArray[counter]"
            :currentIndex="counter"
            :total="Total_Questions"
            :studyTime="6"
            @next="counter++"
            @prev="counter--"
            @answer-selected="handleTimeActivityAnswer" 
            @quiz-finished="showResultPopup"
          />
                 <!-- NSS-I Activity -->
                <PuzzleActivity
                  v-if="jsonFileName === 'NSS-I' && questionArray.length"
                  :key="`puzzle-${jsonFileName}-${counter}`"
                  :questionArray="questionArray"
                  :currentIndex="counter"
                  :total="Total_Questions"
                  :jsonFileName="jsonFileName"
                  activity-type="letter-number"
                  @answer-selected="handlePuzzleAnswer"
                  @next="counter++"
                  @quiz-finished="showResultPopup"
                />

                <!-- CSS-I-01 Activity -->
                <PuzzleActivity
                  v-if="jsonFileName === 'CSS-I-01' && questionArray.length"
                  :key="`puzzle-${jsonFileName}-${counter}`"
                  :questionArray="questionArray"
                  :currentIndex="counter"
                  :total="Total_Questions"
                  :jsonFileName="jsonFileName"
                  activity-type="sudoku"
                  @answer-selected="handlePuzzleAnswer"
                  @next="counter++"
                  @quiz-finished="showResultPopup"
                />

          <!-- CSR-I and Other Activities -->
          <template v-if="!['CFU-P', 'MSU-I','CSS-II', 'NSS-I','CSS-I-01'].includes(jsonFileName)">
            <!-- Instructions Section -->
            <div
              v-if="(currentQuestion || PracticeOne) && !resultShow"
              class="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded"
            >
              <h3 class="font-bold text-lg mb-2 text-blue-700">Instructions</h3>
              <div class="text-lg text-black-700 leading-relaxed">
                {{ activityInstructions.content }}
              </div>
            </div>

            <!-- Main Content Container -->
            <div class="w-full px-2 sm:px-4 lg:px-8">
              <div
                class="containercat3 mx-auto max-w-7xl bg-white shadow-lg border-2 border-black rounded-none p-4 sm:p-6 lg:p-10 my-4 sm:my-6 lg:my-8"
              >
                <!-- CSR-I Word Grid Activity -->
                <WordGridActivity
                  v-if="jsonFileName === 'CSR-I' && currentQuestion"
                  :questionWord="getQuestionWord(currentQuestion)"
                  :gridLetters="getGridLetters(currentQuestion)"
                  :wordLength="3"
                  @answered="handleWordGridAnswered"
                  class="w-full"
                />

                <!-- CSR-I Navigation Controls -->
                <template v-if="jsonFileName === 'CSR-I'">
                  <div class="font-bold mt-3 text-center text-sm sm:text-base">
                    Question
                    <span class="text-indigo-700">{{ counter + 1 }}</span>
                    of
                    <span class="text-indigo-700">{{ Total_Questions }}</span>
                  </div>

                  <div class="flex flex-col sm:flex-row justify-center items-center mt-5 gap-3 px-4">
                    <button
                      :disabled="counter === 0"
                      @click="goToPreviousQuestion"
                      class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-blue-500 text-white font-bold text-sm sm:text-base transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      :disabled="lockedForNext"
                      @click="AnswerCheck"
                      class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-blue-500 text-white font-bold text-sm sm:text-base transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </template>

                <!-- Non-CSR-I Activities -->
                <template v-if="jsonFileName !== 'CSR-I'">
                  <!-- Introduction Section -->
                  <SectionSem3Intro
                    v-show="InstructionShow"
                    @PracticeNext="PracticeNext"
                    class="w-full"
                  />

                  <!-- Story Toggle Button -->
                  <div
                    v-if="showStoryButton"
                    class="mt-6 text-center px-4"
                  >
                    <button
                      @click="showStory = !showStory"
                      class="w-full sm:w-auto px-6 sm:px-10 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {{ showStory ? 'Hide' : 'Show' }} Story Section
                    </button>
                  </div>

                  <!-- Story Section -->
                  <div
                    v-if="showStory"
                    class="mt-6 px-2 sm:px-4"
                  >
                    <SectionStory
                      :currentStory="computedCurrentStory"
                      :paraData="currentPara"
                      class="w-full"
                    />
                  </div>

                  <!-- Main Activity Section -->
                  <div class="mt-4 sm:mt-6">
                    <SectionSem3Top
                      v-show="PracticeOne"
                      :accept-input="acceptInput"
                      @save-and-exit="SaveAndExitNow"
                      @svg-click="handleSvgClick"
                      :commonNumArray="commonNumArray"
                      :ImageNames="ImageNames"
                      :ImageNames1="ImageNames1"
                      :ImageNames2="ImageNames2"
                      :ImageNames3="ImageNames3"
                      :ImageNames4="ImageNames4"
                      :isCMS2="jsonFileName === 'CMS-II'"
                      @NumberValue="NumberValue"
                      @AnswerCheck="AnswerCheck"
                      @NextQuestion="NextQuestion"
                      @WordsAnswer="WordsAnswer"
                      :PrevQuestion="PrevQuestion"
                      @PreviousQuestion="goToPreviousQuestion"
                      :counter="counter"
                      :viewingPrevious="viewingPrevious"
                      :AnswerCheckShow="AnswerCheckShow"
                      :NextQuestionShow="NextQuestionShow"
                      :ProgressBar="ProgressBar"
                      :Questions_attempted="Questions_attempted"
                      :Total_Questions="Total_Questions"
                      :imageHeight="getResponsiveImageHeight()"
                      :imageWidth="getResponsiveImageWidth()"
                      class="w-full"
                    />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </OneToThreeVertical>
</template>


<script>
import 'CSS/tailwind.css'
import baseMixin from 'Scripts/mixinBaseLesson'
import OneToThreeVertical from 'Components/layout-components/LayoutVSplitTwoOne'
import SectionSem3Top from 'Lessons/LessonSem3/components/SectionSem3Top'
import SectionSem3Intro from 'Lessons/LessonSem3/components/SectionSem3Intro'
import resultPopup from '../resultPopup.vue'
import topHeader from '../topHeader.vue'
import SectionStory from './components/SectionStory.vue'
import WordGridActivity from 'Lessons/LessonSem3/components/WordGridActivity.vue'
import TimeActivity from './components/TimeActivity.vue' // ←  import timer activity component
import PuzzleActivity from './components/PuzzleActivity.vue' 
import{ updateScreenSizehelper,getResponsiveImageHeighthelper3,getResponsiveImageWidthhelper3 ,parseLevelRangeHelper, getQuestionWordhelper3,getGridLettershelper3 ,getAnswerWordhelper ,handleWordGridAnsweredhelper, WordsAnswerhelper3, AnswerCheckhelper3, FinalResulthelper3, PracticeNexthelper3, getVisualArrowhelper, getArrowStylehelper, getVisualRectanglehelper, getRectangleStylehelper, secondsToTimehelper, TimerFunhelper3, goToPreviousQuestionhelper3, runhelper3,  highlightPreviousAnswerhelper, practice0helper3, SaveAndExitNowhelper3 , handleSvgClickhelper3,showResultPopuphelper3
} from '../../common-generic-components/activityHelpers.js';
import CFUPHandler from './components/CFUPHandler.vue';
import ElevatorActivity from './components/ElevatorActivity.vue'

export default {
  name: 'Sem3',
  components: {
    ElevatorActivity,
     CFUPHandler,
    OneToThreeVertical,
    resultPopup,
    SectionSem3Top,
    SectionSem3Intro,
    topHeader,
    SectionStory,
    WordGridActivity,
    TimeActivity,
   PuzzleActivity,
  },
  mixins: [baseMixin],
  props: {
    exercise: { type: [Number, String], default: 0 },
    instruction: { type: Number, default: 1 },
    lessonData: { type: Object, default: () => ({}) },
  },
  data() {
    return {
 questionArray: [],


      paraData: '',
      counter: 0,
      viewingPrevious: false,
      activityQuestions: {},
      items: [],
      currentIndex: 0,
      targets: '',
      showStory: false,
      ProgressBar: [],
      practiceList: [],
      commonNumArray: [],
      timestart: 0,
      questionStartTime: 0,
      Questions_attempted: 0,
      correct_Answers: 0,
      incorrect_Answers: 0,
      Time_elapsed: 0,
      activity_Status: 'Inprogress',
      Exercise_Number: '',
      Total_Questions: 15,
      resultShow: false,
      JsonArrData: [],
      AnswerCheckShow: false,
      PrevQuestionShow: false,
      NextQuestionShow: false,
      PracticeOne: false,
      TestProgressBar: 0,
      countcorrect: 0,
      ImageNames: 'L1-1',
      ImageNames1: 'NA',
      ResultHide: false,
      ResultArrow: false,
      ContinuesWrong: 0,
      PracticeTwo: false,
      OptionImg: 'a0',
      InstructionShow: false,
      CollectionResult: [],
      PlayBtnshow: false,
      ShuffleShapes: '',
      selectedLevels: [],
      jsonFileName: sessionStorage.getItem('jsonFile') || 'lesson1',
      lastGridAnswer: null,
      lockedForNext: true,
      screenSize: 'lg',
    }
  },
  async mounted() {
 
    this.updateScreenSize()
    window.addEventListener('resize', this.updateScreenSize)
    const fileName = sessionStorage.getItem('jsonFile') || 'lesson1'
    const jsonFileName = `Lesson${fileName.toUpperCase()}.json`
    console.log("Mounted: loading JSON file", jsonFileName);

  
    const totalQsRaw = parseInt(sessionStorage.getItem('questionCount')) || 15

        const storedResultRaw = sessionStorage.getItem('attemptedQuestionData');
        let attemptedQuestionNumbers = [];
        let attemptedDetails = [];

        let attemptedData = {}; // default to object

        try {
      if (storedResultRaw) {
        let firstParse = JSON.parse(storedResultRaw);
            attemptedData = typeof firstParse === "string" ? JSON.parse(firstParse) : firstParse;
          }
        } catch (err) {
          console.error("Error parsing attemptedData:", err);
        }

        if (
            attemptedData &&
            Array.isArray(attemptedData.DetailedResults) &&
            attemptedData.DetailedResults.length > 0
        ) {


            this.timestart = Number(attemptedData.TimeElapsed) || 0;
            this.Questions_attempted = attemptedData.QuestionsAttempted || 0;
            this.correct_Answers = attemptedData.CorrectAnswers || 0;
            this.incorrect_Answers = attemptedData.IncorrectAnswers || 0;



            attemptedData.DetailedResults.forEach(q => {
                this.practiceList.push({
                    id: q.QuestionIndex,
                    UserResponse: q.UserResponse ?? q.userResponse ?? null,
                    correctAnswers: q.FinalAnswer ? JSON.parse(JSON.stringify(q.FinalAnswer)) : [],
                    isCorrect: q.IsCorrect || false,
                    level: q.Level ?? null,
                    timeTaken: q.TimeTaken ?? 0
                });
            });

        
            this.detailedResults = this.practiceList.map((entry, idx) => {
                return {
                    QuestionIndex: entry.id || 0,
                    Level: entry.level,
                    UserResponse:entry.UserResponse,
                    FinalAnswer: entry.correctAnswers || [],
                    IsCorrect: entry.isCorrect,
                    TimeTaken: entry.timeTaken
                };
            });

        }

         if (storedResultRaw) {
            try {
                let parsed = JSON.parse(storedResultRaw); // first parse

                    if (typeof parsed === "string") {
                    parsed = JSON.parse(parsed); // second parse if still string
                }
                attemptedQuestionNumbers = parsed.AttemptedQuestionNumbers || [];
                attemptedDetails = parsed.DetailedResults || [];
                 console.log("Attempted Question Numbers:" + JSON.stringify(attemptedQuestionNumbers, null, 2));
            } catch (e) {
                console.warn("⚠️ Failed to parse attemptedQuestionData:", e);
            }
        }
        


    if (!jsonFileName) {
      alert('Invalid file name.')
      return
    }
    try {
      const response = await require(`./data/${jsonFileName}`)
      this.activityQuestions = response
    } catch (error) {
      alert(`Failed to load JSON: ${jsonFileName}`)
      console.error(error)
    }
    const activityName = sessionStorage.getItem('ActivityName')
    this.language = sessionStorage.getItem('lang') || 'en'

    const exeNumRaw = sessionStorage.getItem('Exe_Number') || this.exercise || '1'
    this.selectedLevels = this.parseLevelRange(exeNumRaw)
    if (this.selectedLevels.includes(0)) {
      alert('Invalid level: Exe_Number cannot be 0 or out of allowed range.')
      return
    }

        for (const level of this.selectedLevels) {
            const key = `Level${level}`;
            if (Array.isArray(this.activityQuestions[key])) {
                let levelQuestions = this.activityQuestions[key];

                const attemptedForLevel = attemptedDetails
                    .filter(dr => attemptedQuestionNumbers.includes(String(dr.QuestionIndex)) && dr.Level === key)
                    .map(dr => {

                        const questionKey = `QuestionArr_${dr.QuestionIndex}`;
                        const originalQ = levelQuestions.find(q => q[questionKey] !== undefined);

                        
                       if (originalQ) {

                              const selectedIndex = dr.UserResponse ? Number(dr.UserResponse) - 1 : -1;

                              const optionKey = `OptionArr_${String(originalQ.index).padStart(2, "0")}`;
                              const options = originalQ[optionKey] || [];

                              if (Array.isArray(options)) {
                                originalQ[optionKey] = options.map((opt, i) => ({
                                  label: opt,
                                  state: i === selectedIndex ? "selected" : "unselected"
                                }));
                              }

                              console.log("originalQ after:", JSON.stringify(originalQ, null, 2));

                              return {
                                ...originalQ,
                                selectedIndex
                              };
                            }


                        return null;
                    })
                    .filter(Boolean);

               
        

                let remainingQuestions = levelQuestions.filter(q => {
                  const questionKey = Object.keys(q).find(k => k.startsWith('QuestionArr_'));
                  const questionId = questionKey ? questionKey.split('_')[1] : '';
                  return !attemptedQuestionNumbers.includes(questionId);
               });



                for (let i = remainingQuestions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [remainingQuestions[i], remainingQuestions[j]] = [remainingQuestions[j], remainingQuestions[i]];
                }

                // Step 4: Merge attempted first, shuffled remaining after
                const reorderedQuestions = [...attemptedForLevel, ...remainingQuestions];

                // ✅ Update the activityQuestions for this level
                this.activityQuestions[key] = reorderedQuestions;


                // ✅ Combine all selected level questions into a single array
this.questionArray = this.selectedLevels.flatMap(level => {
  const key = `Level${level}`;
  return this.activityQuestions[key] || [];
});

// ✅ Log for verification
console.log("✅ Loaded questionArray:", this.questionArray);

               
let answeredState = Array(this.Total_Questions).fill(false);

// Loop through levels to mark attempted questions
for (const level of this.selectedLevels) {
    const key = `Level${level}`;
    const questions = this.activityQuestions[key] || [];

    questions.forEach((q, idx) => {
        const questionKey = Object.keys(q).find(k => k.startsWith('QuestionArr_'));
        const questionId = questionKey ? questionKey.split('_')[1] : '';
        if (attemptedQuestionNumbers.includes(questionId)) {
            answeredState[idx] = true;
        }
    });
}

// ✅ Set counter to first unanswered question
const firstUnanswered = answeredState.findIndex(a => !a);
if (firstUnanswered !== -1) {
    this.counter = firstUnanswered;
} else {
    // All questions answered; start at last question
    this.counter = this.Total_Questions - 1;
}

console.log("Mounted: starting at question counter =", this.counter);


            }
        }


    this.Total_Questions = parseInt(totalQsRaw)
    this.ProgressBar = Array(this.Total_Questions)
      .fill(null)
      .map((_, i) => ({ index: i }))
    const totalAvailable = this.selectedLevels.reduce((sum, lvl) => {
      const key = `Level${lvl}`
      return (
        sum +
        (Array.isArray(this.activityQuestions[key])
          ? this.activityQuestions[key].length
          : 0)
      )
    }, 0)
    if (totalAvailable < this.Total_Questions) {
      this.Total_Questions = totalAvailable
    }
    const paraData = this.activityQuestions.Level1?.[0]?.Para || ''
    this.paraData = paraData
    this.componentSubtitle = fileName
    this.run()
    this.ProgressBar = Array(this.Total_Questions)
      .fill(null)
      .map((_, i) => ({ index: i, state: null }))
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateScreenSize)
  },
  computed: {
    currentPara() {
      if (!this.showStoryButton || !this.currentQuestion) return ''
      return this.currentQuestion.Para || ''
    },

     activityInstructions() {
    // Fetch instruction directly from the loaded JSON
    return {
      content: this.activityQuestions.Instruction || 'No instructions available.',
      steps: [] // You can add steps if needed, or remove this if not using steps
    }
  },
   currentQuestion() {
  return this.questionArray[this.counter] || {};
},

    showStoryButton() {
      const allowedFiles = ['CMUCMS-I', 'CMUCMS-II','DMU']
      const jsonFile = sessionStorage.getItem('jsonFile')
      return allowedFiles.includes(jsonFile)
    },
    computedCurrentStory() {
      return this.currentPara
    },
  },
  methods: {
// showResultPopup(resultData) {
//   this.resultShow = true;
//   this.resultData = resultData; // store the result data to pass to <resultPopup>
// },
  handleElevatorAnswer(result) {
    console.log('Elevator answer:', result);
    this.Questions_attempted++;
    if (result.isCorrect) {
      this.correct_Answers++;
    } else {
      this.incorrect_Answers++;
    }
    
    // Update progress bar
    if (this.ProgressBar[this.counter]) {
      this.ProgressBar[this.counter].state = result.isCorrect ? 'correct' : 'incorrect';
    }
  },

  showResultPopup(resultData = {}) {
  console.log("showResultPopup called with counters:", {
    attempted: this.Questions_attempted,
    correct: this.correct_Answers,
    incorrect: this.incorrect_Answers
  });
  
  this.resultShow = true;
  this.activity_Status = 'Completed';
  
  // Use the actual counters that were updated during the activity
  // Don't override them with resultData unless you want to use external data
  if (Object.keys(resultData).length > 0) {
    // If resultData is provided, use it
    this.Questions_attempted = resultData.questionsAttempted || this.Questions_attempted;
    this.correct_Answers = resultData.correctAnswers || this.correct_Answers;
    this.incorrect_Answers = resultData.incorrectAnswers || this.incorrect_Answers;
  }
  // Otherwise, use the counters that were already updated during the activity
  
  this.PracticeOne = false;
  this.ResultHide = true; // Show the result section
  this.ResultArrow = false; // Hide arrow initially if needed
},






  showResultPopup(resultData = {}) {
  
   return showResultPopuphelper3(this, resultData);
},

  hideResultPopup() {
    this.resultShow = false;
  },




  
 handlePuzzleAnswer(result) {
    console.log('Puzzle answer:', result);
    this.Questions_attempted++;
    if (result.isCorrect) {
      this.correct_Answers++;
    } else {
      this.incorrect_Answers++;
    }
   
  },  

   




  updateScreenSize() {
      return updateScreenSizehelper(this);
    },
  getResponsiveImageHeight() {
      return getResponsiveImageHeighthelper3(this);
    },
  getResponsiveImageWidth() {
     return  getResponsiveImageWidthhelper3(this);
    },
  parseLevelRange(raw) {
            return parseLevelRangeHelper(this, raw);
    },
  getQuestionWord(question) {
    return getQuestionWordhelper3(question);
    },
  getGridLetters(question) {
   return getGridLettershelper3(question)
    },
  getAnswerWord(question) {
     return getAnswerWordhelper(question)
    },
  handleWordGridAnswered({ word, response }) {
      return handleWordGridAnsweredhelper( this,{ word, response })
    },
  WordsAnswer(Answer, index) {
    return WordsAnswerhelper3(this,Answer,index)
    },




handleSvgClick(event) {
  const { offsetX: x, offsetY: y } = event;
  handleSvgClickhelper3(this, { x, y });
},

 


 handleCFUPClick(clicked) {
    if (clicked) {
      console.log("Correct CFU-P clicked!");
      // mark question correct, update score, etc.
    } else {
      console.log("Incorrect CFU-P click");
    }
  },


  AnswerCheck() {
      return AnswerCheckhelper3(this);
    },

  SaveAndExitNow() {
     return SaveAndExitNowhelper3(this);
    },
  FinalResult() {
     return FinalResulthelper3(this);
    },
  PracticeNext() {
     return PracticeNexthelper3(this);
    },
  getVisualArrow(option) {
     return getVisualArrowhelper(option);
    }, 
  getArrowStyle(option) {
      return getArrowStylehelper(this, option)
    }, 
  getVisualRectangle(option) {
     return getVisualRectanglehelper(option)
    },    
  getRectangleStyle(option) {
    return getRectangleStylehelper( context ,option);
    },
  alreadyAnswered(id) {
      return this.practiceList.some((q) => q.id === id)
    },
  TimerFun() {
     return TimerFunhelper3(this);
    },
  secondsToTime(s) {
      return secondsToTimehelper(s);
    },
  run() {
   return runhelper3(this);
    },
  getPaddedIndex(index) {
      return index.toString().padStart(2, '0')
    },
  goToPreviousQuestion() {
    return goToPreviousQuestionhelper3(this);
    },
  highlightPreviousAnswer() {
      return highlightPreviousAnswerhelper(this);
    },
  practice0() {
      return practice0helper3(this);
    },
  },
}
</script>
<style>
html,
body {
  @apply h-full;
}

.main-bg {
  background-image: url('../../assets/images/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
}

/* Responsive container */
.containercat3 {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: 1536px;
  }
}

/* Existing styles with responsive improvements */
.correct {
  background-color: #d4edda;
  border: 2px solid #28a745;
  transition: all 0.2s ease;
}

.incorrect {
  background-color: #f8d7da;
  border: 2px solid #dc3545;
  transition: all 0.2s ease;
}

.previously-selected {
  background-color: #e2e3e5;
  border: 2px solid #6c757d;
  transition: all 0.2s ease;
}

/* Touch-friendly button styles */
@media (max-width: 767px) {
  button {
    min-height: 44px; /* Apple's recommended minimum touch target */
    min-width: 44px;
  }
}

/* Responsive text scaling */
@media (max-width: 640px) {
  .text-responsive {
    font-size: 0.875rem; /* 14px */
  }
}

@media (min-width: 641px) and (max-width: 1023px) {
  .text-responsive {
    font-size: 1rem; /* 16px */
  }
}

@media (min-width: 1024px) {
  .text-responsive {
    font-size: 1.125rem; /* 18px */
  }
}

/* Improve scrolling on mobile */
@media (max-width: 767px) {
  .main-bg {
    -webkit-overflow-scrolling: touch;
  }
}

/* Focus states for accessibility */
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .correct {
    border-width: 3px;
  }
  
  .incorrect {
    border-width: 3px;
  }
  
  .previously-selected {
    border-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>


