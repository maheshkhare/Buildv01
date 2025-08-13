<template>
<OneToThreeVertical :disable-divider="true">
    <template v-slot:topContent>
        <div class="w-full main-bg">
            <div class="rows-12">
                <topHeader :HeaderTop="HeaderTop" :componentSubtitle="componentSubtitle"></topHeader>
            </div>
            <div class="rows-12">
                <div style="
              margin-left: 5%;
              margin-right: 5%;
              margin-top: 0%;
              margin-bottom: 5%;
            " class="content-center justify-center border bg-white shadow-lg border-black p-10 ...">
                    <resultPopup v-show="resultShow" :activity_Status="activity_Status" :Time_elapsed="Time_elapsed" :Questions_attempted="Questions_attempted" :correct_Answers="correct_Answers" :incorrect_Answers="incorrect_Answers" @FinalResult="FinalResult" :ResultHide="ResultHide" :ResultArrow="ResultArrow"></resultPopup>

                    <SectionSem4Intro v-show="InstructionShow" @PracticeNext="PracticeNext"></SectionSem4Intro>

                    <SectionSem4Top :accept-input="acceptInput" :commonNumArray="commonNumArray" :ImageNames="ImageNames" @save-and-exit="SaveAndExitNow" @NumberValue="NumberValue" @AnswerCheck="AnswerCheck" @NextQuestion="NextQuestion" @WordsAnswer="WordsAnswer" :PrevQuestion="PrevQuestion" @PreviousQuestion="goToPreviousQuestion" :counter="counter" :viewingPrevious="viewingPrevious" v-show="PracticeOne" :AnswerCheckShow="AnswerCheckShow" :NextQuestionShow="NextQuestionShow" :ProgressBar="ProgressBar" :ImageNames1="ImageNames1" :Questions_attempted="Questions_attempted" :Total_Questions="Total_Questions" :symbols="symbolsFromJson" :iconBlanks="iconBlanksFromJson" :paragraph-text="paragraphText" :rectangles="rectangles" :options="options" :isRectangleMode="isRectangleMode" :blanks="currentQuestion.Blanks" :Symbol="currentQuestion.Symbols" :Image="currentQuestion.Image" :isSeasideMode="isSeasideMode" :isLetterFillMode="isLetterFillMode" :symbolColorMap="symbolColorMap" :instructionText="instructionText">
                    </SectionSem4Top>
                </div>
            </div>
        </div>
    </template>
</OneToThreeVertical>
</template>

<script>
import 'CSS/tailwind.css'
import baseMixin from 'Scripts/mixinBaseLesson'
import OneToThreeVertical from 'Components/layout-components/LayoutVSplitTwoOne'
import SectionSem4Top from 'Lessons/LessonSem4/components/SectionSem4Top'
import SectionSem4Intro from 'Lessons/LessonSem4/components/SectionSem4Intro'
import resultPopup from '../resultPopup.vue'
import topHeader from '../topHeader.vue'
import {
    TimerFunHelper,
    secondsToTimeHelper,
    practice0Helper,
    WordsAnswerHelper,
    AnswerCheckHelper,
    NextQuestionHelper,
    SaveAndExitNowHelper,
    FinalResultHelper,
    parseLevelRangeHelper,
    practice0Helper4,
    WordsAnswerHelper4,
    AnswerCheckHelper4,
    SaveAndExitNowHelper4,
    FinalResultHelper4
} from '../../common-generic-components/activityHelpers.js';

export default {
    name: 'Sem4',
    components: {
        OneToThreeVertical,
        resultPopup,
        SectionSem4Top,
        SectionSem4Intro,
        topHeader
    },
    mixins: [baseMixin],
    props: {
        exercise: {
            type: [Number, String],
            default: 0
        },
        instruction: {
            type: Number,
            default: 1
        },
        lessonData: {
            type: Object,
            default: () => ({})
        },
        selectedLevels: Array,
        ProgressBar: Array,
        Total_Questions: Number,
    },
    computed: {
        currentQuestion() {
            return this.items[this.counter] || {};
        },

        isLetterFillMode() {
            return this.currentQuestion?.Type === 'LetterFill';
        }
    },

    data() {
        return {
            counter: 0,
            viewingPrevious: false,
            activityQuestions: {},
            items: [],
            ProgressBar: [],
            practiceList: [],
            detailedResults: [],
            commonNumArray: [],
            timestart: 0,
            questionStartTime: 0,
            Questions_attempted: 0,
            correct_Answers: 0,
            incorrect_Answers: 0,
            Time_elapsed: 0,
            activity_Status: 'Inprogress',
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
            InstructionShow: false,
            PlayBtnshow: false,
            selectedLevels: [],
            symbolsFromJson: [],
            iconBlanksFromJson: [],
            questionNoMap: [],
            symbolColorMap: [],
            instructionText: '',
        }
    },

    async mounted() {
        const fileName = sessionStorage.getItem('jsonFile') || 'CST-II';
        const jsonFileName = `lesson${fileName.toUpperCase()}.json`;
        const totalQsRaw = parseInt(sessionStorage.getItem('questionCount')) || 15;

        // ✅ Retrieve attempted question numbers from localStorage
        const storedResultRaw = localStorage.getItem('attemptedQuestionData');
        let attemptedQuestionNumbers = [];
        let attemptedDetails = [];

        const attemptedData = JSON.parse(storedResultRaw || '{}'); // default to object

        console.log("attemptedData.detailedResults" + JSON.stringify(attemptedData, null, 2));

        if (
            attemptedData &&
            Array.isArray(attemptedData.detailedResults) &&
            attemptedData.detailedResults.length > 0
        ) {

            // ✅ Update summary counts from attemptedData
            this.timestart = attemptedData.summary.totalTimeElapsed || 0;
            this.Questions_attempted = attemptedData.summary.questionsAttempted || 0;
            this.correct_Answers = attemptedData.summary.correctAnswers || 0;
            this.incorrect_Answers = attemptedData.summary.incorrectAnswers || 0;

            console.log("this.timestart", this.timestart);
            console.log("this.correct_Answers", this.correct_Answers);
            console.log("this.incorrect_Answers", this.incorrect_Answers);
            console.log("this.Questions_attempted", this.Questions_attempted);

            attemptedData.detailedResults.forEach(q => {
                this.practiceList.push({
                    id: q.questionNo,
                    blanksAnswer: q.blanksAnswer ? JSON.parse(JSON.stringify(q.blanksAnswer)) : [],
                    isCorrect: q.isCorrect || false,
                    originalQuestionNo: q.originalQuestionNo ?? null,
                    level: q.level ?? null,
                    timeTaken: q.timeTaken ?? 0
                });
            });

            console.log("Practive List" + JSON.stringify(this.practiceList, null, 2));
            // console.log(`✅ Loaded ${this.practiceList} attempted questions into practiceList at start`);

            this.detailedResults = this.practiceList.map((entry, idx) => {
                return {
                    questionNo: entry.id || 0,
                    originalQuestionNo: entry.originalQuestionNo,
                    level: entry.level,
                    rectanglesAnswer: entry.rectanglesAnswer || [],
                    blanksAnswer: entry.blanksAnswer || [],
                    isCorrect: entry.isCorrect,
                    timeTaken: entry.timeTaken
                };
            });

            console.log("Detailed Results: " + JSON.stringify(this.detailedResults, null, 2));
        }

        if (storedResultRaw) {
            try {
                const parsed = JSON.parse(storedResultRaw);
                attemptedQuestionNumbers = parsed.summary?.attemptedQuestionNumbers || [];
                attemptedDetails = parsed.detailedResults || [];
                console.log("🟢 Attempted Question Numbers:", attemptedQuestionNumbers);
            } catch (e) {
                console.warn("⚠️ Failed to parse attemptedQuestionData:", e);
            }
        }

        try {
            const response = require(`./Data/${jsonFileName}`);
            this.activityQuestions = response;
            this.symbolColorMap = response.colorMap;
        } catch (error) {
            alert(`Failed to load JSON: ${jsonFileName}`);
            console.error(error);
            return;
        }

        const exeNumRaw = sessionStorage.getItem('Exe_Number') || '1';
        this.selectedLevels = this.parseLevelRange(exeNumRaw);

        if (this.selectedLevels.includes(0)) {
            alert('Invalid level');
            return;
        }

        this.Total_Questions = totalQsRaw;
        this.ProgressBar = Array(this.Total_Questions).fill(null).map((_, i) => ({
            index: i
        }));

        // ✅ Filter only levels that have questions
        let validLevels = this.selectedLevels.filter(level => {
            const key = `Level${level}`;
            return Array.isArray(this.activityQuestions[key]) && this.activityQuestions[key].length > 0;
        });

        // ✅ If no valid levels, fallback to all available levels in JSON
        if (validLevels.length === 0) {
            alert('Provided level(s) not found in JSON. Loading all available levels.');
            validLevels = Object.keys(this.activityQuestions)
                .filter(key => key.startsWith('Level') && Array.isArray(this.activityQuestions[key]) && this.activityQuestions[key].length > 0)
                .map(key => parseInt(key.replace('Level', '')));
        }

        this.selectedLevels = validLevels;

        // ✅ Reorder JSON: Move attempted questions to start (with updated values)
        for (const level of this.selectedLevels) {
            const key = `Level${level}`;
            if (Array.isArray(this.activityQuestions[key])) {
                let levelQuestions = this.activityQuestions[key];

                // Step 1: Get attempted questions for this level (with restored answers)
                const attemptedForLevel = attemptedDetails
                    .filter(dr => attemptedQuestionNumbers.includes(dr.questionNo) && dr.level === key)
                    .map(dr => {
                        const questionIndex = parseInt(dr.questionNo, 10) - 1;
                        const originalQ = levelQuestions[questionIndex];
                        if (originalQ) {
                            originalQ.Blanks = originalQ.Blanks.map(blank => {
                                const storedBlank = dr.blanksAnswer.find(b => b.id === blank.id);
                                return storedBlank ? {
                                    ...blank,
                                    value: storedBlank.value
                                } : blank;
                            });
                            return originalQ;
                        }
                        return null;
                    })
                    .filter(Boolean);

                // Step 2: Get remaining (non-attempted) questions
                let remainingQuestions = levelQuestions.filter((_, idx) =>
                    !attemptedQuestionNumbers.includes(String(idx + 1).padStart(2, '0'))
                );

                // Step 3: Shuffle only remaining questions
                for (let i = remainingQuestions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [remainingQuestions[i], remainingQuestions[j]] = [remainingQuestions[j], remainingQuestions[i]];
                }

                // Step 4: Merge attempted first, shuffled remaining after
                this.activityQuestions[key] = [...attemptedForLevel, ...remainingQuestions];

                console.log(`✅ Final ${key} order:`, this.activityQuestions[key]);
            }
        }

        const totalAvailable = this.selectedLevels.reduce((sum, lvl) => {
            const key = `Level${lvl}`;
            return sum + this.activityQuestions[key].length;
        }, 0);

        if (totalAvailable < this.Total_Questions) {
            this.Total_Questions = totalAvailable;
        }

        this.componentSubtitle = 'Aiming Your Eyes';

        this.run();
    },

    methods: {
        run() {
            this.InstructionShow = this.mode === 'instruction'
            this.resultShow = false
            this.PlayBtnshow = false
            if (!this.InstructionShow) this.practice0()
        },

        parseLevelRange(raw) {
            return parseLevelRangeHelper(this, raw);
        },

        TimerFun() {
            TimerFunHelper(this);
        },

        secondsToTime(s) {
            secondsToTimeHelper(s, this);
        },

        getPaddedIndex(index) {
            return index.toString().padStart(2, '0')
        },

        goToPreviousQuestion() {
            if (this.counter > 0) {
                this.counter--
                this.countcorrect = 1
                this.viewingPrevious = true
                this.practice0()
            } else {
                console.warn("Already at first question — can't go back further.")
            }
        },

        practice0() {
            practice0Helper4(this);
        },

        WordsAnswer(Answer, index) {
            WordsAnswerHelper4(this, Answer, index);
        },

        AnswerCheck() {
            AnswerCheckHelper4(this);
        },

        SaveAndExitNow() {
            SaveAndExitNowHelper4(this);
        },

        FinalResult() {
            FinalResultHelper4(this);
        },

        PracticeNext() {
            this.InstructionShow = false
            this.practice0()
        }
    }
}
</script>

<style>
html,
body {
    @apply h-full;
}

.main-bg {
    background-image: url('../../assets/images/bg.png');
    width: 100%;
}
</style>
