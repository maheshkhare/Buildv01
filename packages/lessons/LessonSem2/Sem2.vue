<template>
<OneToThreeVertical :disable-divider="true">
    <template v-slot:topContent>
        <div class="w-full">
            <div class="rows-12 relative">
                <topHeader :header-top="HeaderTop" :component-subtitle="componentSubtitle" :instruction-no="instructionNo" :practiceno="practiceno"></topHeader>
            </div>
            <div class="rows-12 relative"></div>
            <div class="rows-12">
                <div class="content-center justify-center border border-black p-10" style="margin: 2% 5% 5% 5%;">
                    <resultPopup v-show="resultShow" :activity_Status="activity_Status" :Time_elapsed="Time_elapsed" :Questions_attempted="Questions_attempted" :correct_Answers="correct_Answers" :incorrect_Answers="incorrect_Answers" @FinalResult="FinalResult" :ResultHide="ResultHide" :ResultArrow="ResultArrow" />

                    <SectionSem2Intro v-show="InstructionShow" :instructionText="currentInstructionText" @PracticeNext="PracticeNext" />

                    <SectionSem2Top v-show="PracticeOne"
                                    :accept-input="acceptInput"
                                    :commonNumArray="commonNumArray"
                                    :ImageNames="ImageNames"
                                    @NumberValue="NumberValue"
                                    @AnswerCheck="AnswerCheck"
                                    @save-and-exit="SaveAndExitNow"
                                    @NextQuestion="NextQuestion"
                                    @PreviousQuestion="PreviousQuestion"
                                    @WordsAnswer="WordsAnswer"
                                    :AnswerCheckShow="AnswerCheckShow"
                                    :NextQuestionShow="NextQuestionShow"
                                    :ProgressBar="ProgressBar"
                                    :Questions_attempted="Questions_attempted"
                                    :Total_Questions="Total_Questions"
                                    :instructionText="currentInstructionText"
                                    :counter="counter"
                                    :imageSet="currentImageSet" />
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
import {
    TimerFunHelper,
    secondsToTimeHelper,
    practice0Helper,
    WordsAnswerHelper,
    AnswerCheckHelper,
    NextQuestionHelper,
    SaveAndExitNowHelper,
    FinalResultHelper
} from '../../common-generic-components/activityHelpers.js';

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
        },
        timestart: { type: Number, default: 0 },
        Questions_attempted: { type: Number, default: 0 },
        correct_Answers: { type: Number, default: 0 },
        incorrect_Answers: { type: Number, default: 0 },
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
            questionNoMap: [],
            componentSubtitle: 'CFS-I-1-V-I',
            questionStartTime: 0
        };
    },
    computed: {
        currentInstructionText() {
            return this.instructionMap ?.[this.counter] || '';
        }
    },

    mounted() {
        if (this.lessonData.instructionSets) {
            this.instructionMap = [];
            this.questionNoMap = [];
            this.questionSet = [];
            this.instructionGroups = this.lessonData.instructionSets;
            if (this.lessonData.activityName) {
                this.componentSubtitle = this.lessonData.activityName;
            }

            this.instructionGroups.forEach(group => {
                group.questions.forEach(q => {
                    this.questionSet.push(q);
                    this.instructionMap.push(q.instructionText || '');
                    this.questionNoMap.push(q.questionNo || 0);
                });
            });

            this.Total_Questions = this.questionSet.length;
            this.answeredState = Array(this.Total_Questions).fill(false);

            // console.log("this.answeredState: " + JSON.stringify(this.answeredState, null, 2));

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

            // ✅ Restore attempted questions at start
        // const storedResultRaw = localStorage.getItem('attemptedQuestionData');
        const storedResultRaw = sessionStorage.getItem('attemptedQuestionData');
        if (storedResultRaw) {
            try {
                let parsed = {};

                try {
                if (storedResultRaw) {
                    let firstParse = JSON.parse(storedResultRaw);

                    // If firstParse is still a string (double encoded), parse again
                    parsed = typeof firstParse === "string" ? JSON.parse(firstParse) : firstParse;
                }
                } catch (err) {
                      console.error("Error parsing attemptedData:", err);
                }

                const attemptedDetails = parsed.DetailedResults || [];

                 console.log("attemptedDetails in sem 2:", JSON.stringify(attemptedDetails, null, 2));

                attemptedDetails.forEach(dr => {
                    const questionIndex = this.questionSet.findIndex(q => q.questionNo === dr.QuestionIndex);
                    if (questionIndex !== -1) {
                        // mark question as answered
                        this.answeredState[questionIndex] = true;

                        // restore commonNumArray state if options exist
                        const currentQ = this.questionSet[questionIndex];
                        if (currentQ.options) {
                            currentQ.options = currentQ.options.map((opt, i) => ({
                                ...opt,
                                state: dr.UserResponse == i + 1 ? 'selected' : 'unselected'
                            }));
                        }

                        // add to CollectionResult
                        this.CollectionResult.push({
                            QuestionIndex: dr.QuestionIndex,
                            Level: dr.Level,
                            UserResponse: dr.UserResponse,
                            FinalAnswer: dr.FinalAnswer,
                            TimeTaken: dr.TimeTaken,
                            IsCorrect: dr.IsCorrect
                        });
                    }
                });

                 console.log("this.CollectionResult:", JSON.stringify(this.CollectionResult, null, 2));

                // ✅ Update ProgressBar based on restored answers
                this.CollectionResult.forEach(cr => {
                    const idx = this.questionSet.findIndex(q => q.questionNo === cr.QuestionIndex);
                    if (idx !== -1) {
                        const isCorrect = cr.FinalAnswer.every(a => a === 'Yes');
                        console.log("isCorrect", JSON.stringify(isCorrect, null, 2));
                        this.ProgressBar[idx].state = isCorrect ? 'correct' : 'incorrect';
                    }
                });

                // ✅ Set counter to first unanswered question
const firstUnanswered = this.answeredState.findIndex(a => !a);
if (firstUnanswered !== -1) {
    this.counter = firstUnanswered;
} else {
    // All questions answered; start at last question
    this.counter = this.Total_Questions - 1;
}

console.log("Mounted: starting at question counter =", this.counter);


            } catch (e) {
                console.warn("Failed to parse attemptedQuestionData:", e);
            }
        }

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
            TimerFunHelper(this);
        },

        secondsToTime(s) {
            secondsToTimeHelper(s, this);
        },

        PracticeNext() {
            this.InstructionShow = false;
            this.practice0();
        },

        practice0() {
            practice0Helper(this);
        },

        WordsAnswer(Answer, index) {
            WordsAnswerHelper(this, Answer, index);
        },

        AnswerCheck() {
            AnswerCheckHelper(this);
        },

        PreviousQuestion() {
            if (this.counter > 0) {
                this.counter--;
                this.practice0();
            }
        },

        NextQuestion() {
            NextQuestionHelper(this);
        },

        SaveAndExitNow() {
            SaveAndExitNowHelper(this);
        },

        FinalResult() {
            FinalResultHelper(this);
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
