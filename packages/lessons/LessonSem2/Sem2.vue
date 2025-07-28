<template>
<OneToThreeVertical :disable-divider="true">
    <template v-slot:topContent>

        <div class="w-full">
            <div class="rows-12 relative">
                <topHeader :header-top="HeaderTop" :component-subtitle="componentSubtitle" :instruction-no="instructionNo" :practiceno="practiceno"></topHeader>
            </div>
            <div class="rows-12 relative"></div>
            <div class="rows-12">
                <div class="content-center justify-center border border-black p-10" style="margin: 2% 5% 5% 5%">
                    <resultPopup v-show="resultShow" :activity_Status="activity_Status" :Time_elapsed="Time_elapsed" :Questions_attempted="Questions_attempted" :correct_Answers="correct_Answers" :incorrect_Answers="incorrect_Answers" @FinalResult="FinalResult" :ResultHide="ResultHide" :ResultArrow="ResultArrow" />

                    <SectionSem2Intro v-show="InstructionShow" :instructionText="currentInstructionText" @PracticeNext="PracticeNext" />

                    <SectionSem2Top v-show="PracticeOne" :accept-input="acceptInput" :commonNumArray="commonNumArray" :ImageNames="ImageNames" @NumberValue="NumberValue" @AnswerCheck="AnswerCheck" @NextQuestion="NextQuestion" @PreviousQuestion="PreviousQuestion" @WordsAnswer="WordsAnswer" :AnswerCheckShow="AnswerCheckShow" :NextQuestionShow="NextQuestionShow" :ProgressBar="ProgressBar" :Questions_attempted="Questions_attempted" :Total_Questions="Total_Questions" :instructionText="currentInstructionText" :counter="counter" :imageSet="currentImageSet" />
                </div>
            </div>
        </div>
    </template>
</OneToThreeVertical>
</template>

<script>
import 'CSS/tailwind.css';
import baseMixin from 'Scripts/mixinBaseLesson';
import OneToThreeVertical from 'Components/layout-components/LayoutVSplitTwoOne';
import SectionSem2Top from 'Lessons/LessonSem2/components/SectionSem2Top';
import SectionSem2Intro from 'Lessons/LessonSem2/components/SectionSem2Intro';
import resultPopup from '../resultPopup.vue';
import topHeader from '../topHeader.vue'

export default {
    name: 'Sem2',
    components: {
        OneToThreeVertical,
        resultPopup,
        SectionSem2Top,
        SectionSem2Intro,
        topHeader
    },
    mixins: [baseMixin],
    props: {
        exercise: {
            type: Number,
            default: 0,
            validator: val => [0, 1, 2, 3].includes(val)
        },
        instruction: {
            type: Number,
            default: 1,
            validator: val => [1].includes(val)
        },
        lessonData: {
            type: Object,
            default: () => ({})
        },
        acceptInput: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            questionSet: [],
            answeredState: [],
            commonNumArray: [],
            timestart: 0,
            Questions_attempted: 0,
            correct_Answers: 0,
            incorrect_Answers: 0,
            Time_elapsed: 0,
            activity_Status: 'Inprogress',
            ImageNames: '1',
            counter: 0,
            Total_Questions: 0,
            AnswerCheckShow: false,
            NextQuestionShow: false,
            PracticeOne: false,
            InstructionShow: false,
            resultShow: false,
            ResultHide: false,
            ResultArrow: false,
            PlayBtnshow: false,
            countcorrect: 0,
            JsonArrData: [],
            CollectionResult: [],
            TestProgressBar: 0,
            ProgressBar: [],
            selectedIndices: [],
            matchedImageMode: false,
            instructionGroups: [],
            instructionMap: [],
            componentSubtitle: 'CFS-I-1-V-I',
            questionStartTime: 0
        };
    },
    computed: {
        // currentImageSet() {
        //     const imageSet = (this.questionSet && this.questionSet[this.counter] && this.questionSet[this.counter].imageSet) ?
        //         this.questionSet[this.counter].imageSet :
        //         null;

        //     console.log("🔍 computed.currentImageSet triggered:", imageSet);
        //     return imageSet;
        // },
        currentInstructionText() {
            console.log("in computed areadfghjkjhgf" + this.instructionMap ?. [this.counter] || '');
            return this.instructionMap ?. [this.counter] || '';
        }
    },

    mounted() {
        if (this.lessonData.instructionSets) {
            this.instructionMap = [];
            this.questionSet = [];
            this.instructionGroups = this.lessonData.instructionSets;
            console.log("activity Name" + this.lessonData.activityName);
            if (this.lessonData.activityName) {
                this.componentSubtitle = this.lessonData.activityName;
            }

            this.instructionGroups.forEach(group => {

                group.questions.forEach(q => {
                    this.questionSet.push(q);
                    this.instructionMap.push(q.instructionText || ''); // One instruction per question
                    console.log("in mounted" + this.instructionMap);
                });
            });

            this.Total_Questions = this.questionSet.length;
            this.answeredState = Array(this.Total_Questions).fill(false);

            this.ProgressBar = Array.from({
                length: this.Total_Questions
            }, (_, i) => ({
                shape: 'square',
                index: i,
                state: 'base',
                width: 'narrow',
                height: 'short',
                size: 'xl'
            }));

            this.run();
        }
    },

    methods: {
        run() {
            if (this.mode === 'instruction') {
                this.InstructionShow = true;
                this.resultShow = false;
            } else {
                this.InstructionShow = false;
                this.practice0();
            }
        },
        TimerFun() {
            setInterval(() => {
                if (this.timestart < 9999999999) this.timestart++;
            }, 1000);
        },
        secondsToTime(s) {
            const h = String(Math.floor(s / 3600)).padStart(2, '0');
            const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
            const sec = String(s % 60).padStart(2, '0');
            return `${h}:${m}:${sec}`;
        },
        PracticeNext() {
            this.InstructionShow = false;
            this.practice0();
        },
        practice0() {
            this.TimerFun();
            this.resultShow = false;
            this.PracticeOne = true;

            this.questionStartTime = this.timestart;
            const current = this.questionSet[this.counter];
            this.ImageNames = current.image;

            const isAnswered = this.answeredState[this.counter];

            this.countcorrect = isAnswered ? 1 : 0;

            // 👇 Only show "AnswerCheck" if question is unanswered
            this.AnswerCheckShow = !isAnswered;
            this.NextQuestionShow = isAnswered;

            this.matchedImageMode = !!current.imageSet;

            if (current.imageSet) {
                // ✅ Create commonNumArray from imageSet
                this.commonNumArray = current.imageSet.map((item, i) => {
                    let state = 'unselected';
                    if (isAnswered) {
                        state = item.isCorrect ? 'correct' : 'incorrect';
                    }
                    return {
                        index: i,
                        state,
                        Question: item.label, // image filename
                        Answer: item.isCorrect ? 'Yes' : ''
                    };
                });
            } else if (current.options) {
                this.commonNumArray = current.options.map((opt, i) => {
                    let state = 'base';
                    if (isAnswered) {
                        state = opt.isCorrect ? 'correct' : 'incorrect';
                    }
                    return {
                        index: i,
                        state,
                        Question: opt.label,
                        Answer: opt.isCorrect ? 'Yes' : ''
                    };
                });
            } else {
                this.commonNumArray = [];
            }
        },

WordsAnswer(Answer, index) {
  if (!this.matchedImageMode) {
    // ✅ Regular word-based option → auto check on select
    this.commonNumArray.forEach(opt => {
      opt.state = 'unselected';
    });

    this.commonNumArray[index].state = 'selected';
    this.lastSelectedIndex = index;

    // Do not lock yet! Remove these:
    // this.countcorrect = 1;
    // this.answeredState[this.counter] = true;

    // Also: Do not push result or update progress bar yet.
    // Just mark the option visually selected.

    this.AnswerCheckShow = false;
    this.NextQuestionShow = true;
  } else {
    // ✅ IMAGE MATCH MODE unchanged
    const selectedIndex = this.selectedIndices.indexOf(index);

    if (selectedIndex > -1) {
      this.selectedIndices.splice(selectedIndex, 1);
      this.commonNumArray[index].state = 'unselected';
    } else {
      this.selectedIndices.push(index);
      this.commonNumArray[index].state = 'selected';
    }

    if (this.selectedIndices.length === 2) {
      const [i1, i2] = this.selectedIndices;
      const img1 = this.commonNumArray[i1];
      const img2 = this.commonNumArray[i2];

      const isMatch = img1.Question === img2.Question && img1.Answer === 'Yes' && img2.Answer === 'Yes';

      if (isMatch) {
        this.commonNumArray[i1].state = 'correct';
        this.commonNumArray[i2].state = 'correct';
        this.ProgressBar[this.TestProgressBar].state = 'correct';
        this.correct_Answers++;
      } else {
        this.commonNumArray[i1].state = 'incorrect';
        this.commonNumArray[i2].state = 'incorrect';
        this.ProgressBar[this.TestProgressBar].state = 'incorrect';
        this.incorrect_Answers++;
      }

      this.countcorrect = 1;
      this.answeredState[this.counter] = true;
      this.Questions_attempted++;
      this.TestProgressBar++;
      this.AnswerCheckShow = false;
      this.NextQuestionShow = true;

      this.CollectionResult.push({
        questionNo: this.counter + 1,
        originalQuestionNo: this.questionSet[this.counter].id || this.counter + 1,
        level: this.questionSet[this.counter].level || 'Level1',
        userResponse: isMatch ? `${i1 + 1},${i2 + 1}` : 'Mismatch',
        fullCorrectAnswer: this.commonNumArray.map(opt => opt.Answer),
        timeTaken: (this.timestart - this.questionStartTime) ?? 0.0
      });

      this.selectedIndices = [];
    }
  }
},



        AnswerCheck() {
            if (!this.matchedImageMode) {
                if (this.countcorrect === 0) {
                    const index = this.lastSelectedIndex;

                    if (index === undefined) {
                        alert('Please select an option first!');
                        return;
                    }

                    const Answer = this.commonNumArray[index].Answer;
                    const isCorrect = Answer === 'Yes';

                    this.countcorrect = 1; // ✅ mark this question as checked
                    this.TestProgressBar++;
                    this.ProgressBar[this.TestProgressBar - 1].state = isCorrect ? 'correct' : 'incorrect';
                    this.commonNumArray[index].state = isCorrect ? 'correct' : 'incorrect';

                    if (isCorrect) {
                        this.correct_Answers++;
                    } else {
                        this.incorrect_Answers++;
                    }

                    this.answeredState[this.counter] = true;

                    this.Questions_attempted++;

                    this.CollectionResult.push({
                        questionNo: this.Questions_attempted + 1,
                        originalQuestionNo: this.questionSet[this.counter].id || this.counter + 1,
                        level: this.questionSet[this.counter].level || 'Level1',
                        userResponse: (index + 1).toString(),
                        fullCorrectAnswer: this.commonNumArray.map(opt => opt.Answer),
                        timeTaken: (this.timestart - this.questionStartTime) ?? 0.0
                    });
                    

                    this.AnswerCheckShow = false;
                    this.NextQuestionShow = true;
                }
            }
            // Matching mode is handled inline already
        },

        PreviousQuestion() {
            if (this.counter > 0) {
                this.counter--;
                this.practice0();
            }
        },

     NextQuestion() {
  if (!this.answeredState[this.counter]) {
    // Finalize answer for word-based
    const index = this.lastSelectedIndex;
    if (index !== undefined) {
      const Answer = this.commonNumArray[index].Answer;
      const isCorrect = Answer === 'Yes';

      this.countcorrect = 1;
      this.TestProgressBar++;
      this.ProgressBar[this.TestProgressBar - 1].state = isCorrect ? 'correct' : 'incorrect';
      this.commonNumArray[index].state = isCorrect ? 'correct' : 'incorrect';

      if (isCorrect) this.correct_Answers++;
      else this.incorrect_Answers++;

      this.answeredState[this.counter] = true;
      this.Questions_attempted++;

      this.CollectionResult.push({
        questionNo: this.Questions_attempted,
        originalQuestionNo: this.questionSet[this.counter].id || this.counter + 1,
        level: this.questionSet[this.counter].level || 'Level1',
        userResponse: (index + 1).toString(),
        fullCorrectAnswer: this.commonNumArray.map(opt => opt.Answer),
        timeTaken: (this.timestart - this.questionStartTime) ?? 0.0
      });
    }
  }

  // ✅ Then move next as normal
  if (this.counter < this.Total_Questions - 1) {
    this.counter++;
    this.countcorrect = 0;
    this.lastSelectedIndex = undefined;
    this.practice0();
  } else {
    this.activity_Status = 'Completed';
    this.Time_elapsed = this.secondsToTime(this.timestart);
    this.resultShow = true;
    this.PracticeOne = false;
    this.ResultHide = true;

    this.JsonArrData = JSON.stringify({
      ActivityStatus: this.activity_Status,
      TimeElapsed: this.Time_elapsed,
      QuestionsAttempted: this.Questions_attempted,
      CorrectAnswers: this.correct_Answers,
      IncorrectAnswers: this.incorrect_Answers,
      ExerciseNumber: this.exercise
    });
  }
},


        FinalResult() {
            const resultData = {
                summary: {
                    ActivityName: "Sem2",
                    activityStatus: this.activity_Status,
                    totalTimeElapsed: this.timestart,
                    questionsAttempted: this.Questions_attempted,
                    correctAnswers: this.correct_Answers,
                    incorrectAnswers: this.incorrect_Answers,
                    testDate: new Date().toISOString()
                },
                detailedResults: this.CollectionResult
            };

            // Download JSON
            const filename = `Lesson_${this.exercise}_Result.json`;
            const jsonStr = JSON.stringify(resultData, null, 2);
            const blob = new Blob([jsonStr], {
                type: "application/json"
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);

            // Redirect (optional)
            const curSite = `${window.location.protocol}//${window.location.host}`;
            const url = `${curSite}/solutions/Appfiles/cmActivityResult.aspx?TokenID=${sessionStorage.getItem('sesTokenID')}&JsonData=${this.CollectionResult}&Activityresult=${this.JsonArrData}&ExeID=${sessionStorage.getItem('ExeID')}&exNum=${sessionStorage.getItem('Exe_Number')}&studentID=${sessionStorage.getItem('studentID')}`;
            window.location.href = url;
        }

    }
};
</script>

<style>
html,
body {
    @apply h-full;
}
</style>
