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

    
    console.log("attemptedData.detailedResults"+JSON.stringify(attemptedData, null, 2));

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

    console.log("Practive List"+JSON.stringify(this.practiceList, null, 2));
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
                        return storedBlank ? { ...blank, value: storedBlank.value } : blank;
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
        parseLevelRange(raw) {
            if (typeof raw === 'number') return [raw]
            if (typeof raw === 'string') {
                raw = raw.trim()
                if (/^\d+$/.test(raw)) return [parseInt(raw)]
                const rangeMatch = raw.match(/^(\d+)-(\d+)$/)
                if (rangeMatch) {
                    const [min, max] = rangeMatch.slice(1).map(Number)
                    return Array.from({
                        length: max - min + 1
                    }, (_, i) => min + i)
                }
            }
            return [0]
        },

        TimerFun() {
            setInterval(() => {
                this.timestart++
            }, 1000)
        },
        secondsToTime(s) {
            const h = String(Math.floor(s / 3600)).padStart(2, '0')
            const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
            const sec = String(s % 60).padStart(2, '0')
            return `${h}:${m}:${sec}`
        },
        run() {
            this.InstructionShow = this.mode === 'instruction'
            this.resultShow = false
            this.PlayBtnshow = false
            if (!this.InstructionShow) this.practice0()
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
            if (this.items.length === 0) {
                this.TimerFun();
                this.AnswerCheckShow = true;
                this.PracticeOne = true;
                this.questionNoMap = [];

                const selectedItems = [];
                const levels = this.selectedLevels;
                const questionsPerLevel = Math.floor(this.Total_Questions / levels.length);
                let remaining = this.Total_Questions % levels.length;

                for (const level of levels) {
                    const levelKey = `Level${level}`;
                    const levelItems = this.activityQuestions[levelKey] || [];
                    let count = questionsPerLevel + (remaining > 0 ? 1 : 0);
                    if (remaining > 0) remaining--;

                    const shuffled = levelItems.slice().sort(() => Math.random() - 0.5);
                    const subset = levelItems.slice(0, count).map(item => ({
                        ...item,
                        __index: levelItems.indexOf(item),
                        __level: levelKey
                    }));
                    selectedItems.push(...subset);
                }

                this.items = selectedItems;
            }

            if (this.counter >= this.items.length) return;

            const questionObj = this.items[this.counter];

            // If you stored the whole level key
            const levelKey = this.items[this.counter].__level;
            this.instructionText = this.activityQuestions[levelKey][0].Instruction || '';

            const questionKey = Object.keys(questionObj).find(k => k.startsWith('QuestionArr_'));

            if (questionKey) {
              const questionNum = questionKey.replace('QuestionArr_', '');
              this.questionNoMap.push(questionNum);
              console.log("Stored Question No: ", this.questionNoMap);
            }
            const optionKey = Object.keys(questionObj).find(k => k.startsWith('OptionArr_'));
            const answerKey = Object.keys(questionObj).find(k => k.startsWith('AnswerArr_'));

            this.questionStartTime = Date.now();

            if (
                questionObj.rectangles &&
                questionObj.options &&
                questionObj.rectangles.length > 0 &&
                questionObj.options.length > 0
            ) {
                this.rectangles = questionObj.rectangles;
                this.options = questionObj.options;
                this.isRectangleMode = true;

                this.paragraphText = questionObj[questionKey] || '';
                this.selectedRectangleIndex = 0;

                this.symbolsFromJson = [];
                this.iconBlanksFromJson = [];
                this.commonNumArray = [];

                return;
            } else {
                this.isRectangleMode = false;
            }

            // ✅ Normal paragraph text
            this.paragraphText = questionObj[questionKey] || '';

            const symbols = questionObj.Symbols || [];
            const blanks = questionObj.Blanks || [];

            this.symbolsFromJson = symbols;
            this.iconBlanksFromJson = blanks;

            if (blanks.length > 0) {
                this.selectedIconBox = blanks[0].id;
                this.selectedIconBoxIndex = 0;
            } else {
                this.selectedIconBox = null;
                this.selectedIconBoxIndex = 0;
            }

            // 🟢 Is it blanks question?
            const isBlanksQuestion = symbols.length > 0 && blanks.length > 0;

            if (isBlanksQuestion) {
                this.commonNumArray = [{
                    Question: questionObj[questionKey] || '',
                    Option: [],
                    Answer: []
                }];
            } else {
                const QuestionValue = questionObj[questionKey] || '';
                const OptionValue = questionObj[optionKey] || [];
                let AnswerValue = questionObj[answerKey] || [];

                if (!Array.isArray(AnswerValue)) AnswerValue = [];

                this.commonNumArray = OptionValue.map((opt, i) => {
                    return {
                        index: i,
                        state: 'base',
                        Answer: AnswerValue[i],
                        Option: opt,
                        Question: QuestionValue
                    };
                });
            }

            this.PrevQuestionShow = this.counter > 0;
        },

        WordsAnswer(Answer, index) {
            const questionId = this.counter + 1
            if (this.viewingPrevious) {
                alert("You have already answered this question. This cannot be changed now.")
                return
            }

            const currentQuestionObj = this.items[this.counter]
            const paddedIndex = this.getPaddedIndex(currentQuestionObj.__index)

            let correctAnswerArr = currentQuestionObj[`AnswerArr_${paddedIndex}`] || []
            if (!Array.isArray(correctAnswerArr)) correctAnswerArr = []

            const timeTaken = (Date.now() - this.questionStartTime) / 1000

            const existingIndex = this.practiceList.findIndex(q => q.id === questionId)
            if (existingIndex !== -1) {
                const old = this.practiceList[existingIndex]
                const wasCorrect = old.fullCorrectAnswer[old.userAnswer - 1] === 'Yes'
                if (wasCorrect) this.correct_Answers--
                else this.incorrect_Answers--

                this.practiceList.splice(existingIndex, 1)
            } else {
                this.Questions_attempted++
            }

            this.practiceList.push({
                id: questionId,
                originalQuestionNo: currentQuestionObj.__index,
                level: currentQuestionObj.__level,
                userAnswer: (index + 1).toString(),
                fullCorrectAnswer: correctAnswerArr,
                timeTaken
            })

            const isCorrect = correctAnswerArr[index] === 'Yes'

            if (isCorrect) {
                this.correct_Answers++
                this.ContinuesWrong = 0
                this.ProgressBar[this.counter].state = 'correct'
            } else {
                this.incorrect_Answers++
                this.ContinuesWrong++
                this.ProgressBar[this.counter].state = 'incorrect'
            }

            this.commonNumArray.forEach((opt, i) => {
                opt.state = i === index ?
                    isCorrect ? 'correct' : 'incorrect' :
                    'base'
            })

            this.countcorrect = 1

            if (this.counter + 1 > this.TestProgressBar) {
                this.TestProgressBar = this.counter + 1
            }
        },

        AnswerCheck() {
            const questionId = this.counter + 1;

            const isBlanksQuestion = this.symbolsFromJson.length > 0 && this.iconBlanksFromJson.length > 0;
            const isRectangleQuestion = this.isRectangleMode && this.rectangles.length > 0 && this.options.length > 0;

            // ✅ Letter Fill Mode (Seaside)
            if (this.isLetterFillMode) {

                if (!this.currentQuestion || !this.currentQuestion.Blanks) {
                    return;
                }

                let allFilled = true;
                let allCorrect = true;

                for (const blank of this.currentQuestion.Blanks) {
                    let userAnswer = blank.firstSymbol || '';

                    if (blank["1stBlankValue"]) userAnswer += blank["1stBlankValue"];
                    if (blank["2ndBlankValue"]) userAnswer += blank["2ndBlankValue"];
                    if (blank["3rdBlankValue"]) userAnswer += blank["3rdBlankValue"];
                    if (blank["4thBlankValue"]) userAnswer += blank["4thBlankValue"];
                    if (blank["5thBlankValue"]) userAnswer += blank["5thBlankValue"];
                    if (blank["6thBlankValue"]) userAnswer += blank["6thBlankValue"];
                    if (blank["7thBlankValue"]) userAnswer += blank["7thBlankValue"];

                    if (blank.lastSymbol) userAnswer += blank.lastSymbol;

                    console.log(`Blank ${blank.id} → User: ${userAnswer} | Correct: ${blank.CorrectValue}`);

                    if (userAnswer.length < 2) {
                        allFilled = false;
                        break;
                    }

                    if (userAnswer !== blank.CorrectValue) {
                        allCorrect = false;
                    }
                }

                if (!allFilled) {
                    this.$toast ?.warning('Please fill all blanks before moving on.');
                    return;
                }

                const alreadyInList = this.practiceList.find(q => q.id === questionId);
                if (!alreadyInList) {
                    this.practiceList.push({
                        id: questionId,
                        blanksAnswer: JSON.parse(JSON.stringify(this.currentQuestion.Blanks)),
                        isCorrect: allCorrect,
                        originalQuestionNo: this.items[this.counter].__index,
                        level: this.items[this.counter].__level,
                        timeTaken: (Date.now() - this.questionStartTime) / 1000
                    });
                    this.Questions_attempted++;

                    if (allCorrect) {
                        this.correct_Answers++;
                        this.ProgressBar[this.counter].state = 'correct';
                    } else {
                        this.incorrect_Answers++;
                        this.ProgressBar[this.counter].state = 'incorrect';
                    }
                }
            } else if (isRectangleQuestion) {
                let allFilled = true;
                let allCorrect = true;

                for (const rect of this.rectangles) {
                    if (!rect.chosenOption) {
                        allFilled = false;
                        break;
                    }

                    if (typeof rect.chosenOption === 'string') {
                        if (rect.chosenOption !== rect.correctLetter) {
                            allCorrect = false;
                        }
                    } else {
                        if (rect.chosenOption.letter !== rect.correctLetter) {
                            allCorrect = false;
                        }
                    }
                }

                if (!allFilled) {
                    this.$toast ?.warning('Please match all rectangles before moving on.');
                    console.log("This is the print statement" + allFilled);
                    return;
                }

                const alreadyInList = this.practiceList.find(q => q.id === questionId);
                if (!alreadyInList) {
                    this.practiceList.push({
                        id: questionId,
                        rectanglesAnswer: JSON.parse(JSON.stringify(this.rectangles)),
                        isCorrect: allCorrect,
                        originalQuestionNo: this.items[this.counter].__index,
                        level: this.items[this.counter].__level,
                        timeTaken: (Date.now() - this.questionStartTime) / 1000
                    });
                    this.Questions_attempted++;

                    if (allCorrect) {
                        this.correct_Answers++;
                        this.ProgressBar[this.counter].state = 'correct';
                    } else {
                        this.incorrect_Answers++;
                        this.ProgressBar[this.counter].state = 'incorrect';
                    }
                }
            } else if (isBlanksQuestion) {

                const correctMap = this.iconBlanksFromJson.reduce((acc, b) => {
                    acc[b.id] = b.CorrectValue;
                    return acc;
                }, {});

                let allFilled = true;
                let allCorrect = true;

                for (const blank of this.iconBlanksFromJson) {
                    if (!blank.value) {
                        allFilled = false;
                        break;
                    }
                    const correctValue = correctMap[blank.id];
                    if (blank.value !== correctValue) {
                        allCorrect = false;
                    }
                }

                if (!allFilled) {
                    this.$toast ?.warning('Please fill all blanks before moving on.');
                    return;
                }

                const alreadyInList = this.practiceList.find(q => q.id === questionId);
                if (!alreadyInList) {
                    this.practiceList.push({
                        id: questionId,
                        blanksAnswer: JSON.parse(JSON.stringify(this.iconBlanksFromJson)),
                        isCorrect: allCorrect,
                        originalQuestionNo: this.items[this.counter].__index,
                        level: this.items[this.counter].__level,
                        timeTaken: (Date.now() - this.questionStartTime) / 1000
                    });
                    this.Questions_attempted++;

                    if (allCorrect) {
                        this.correct_Answers++;
                        this.ProgressBar[this.counter].state = 'correct';
                    } else {
                        this.incorrect_Answers++;
                        this.ProgressBar[this.counter].state = 'incorrect';
                    }
                }
            } else {
                const hasAnswered = this.practiceList.some(q => q.id === questionId);

                if (!hasAnswered) {
                    this.$toast ?.warning('Please answer the question before moving on.');
                    return;
                }
            }

            // ✅ ✅ ✅ Next or Complete
            if (this.counter < this.Total_Questions - 1) {
                this.counter++;
                const nextAnswered = this.practiceList.some(q => q.id === this.counter + 1);
                this.countcorrect = nextAnswered ? 1 : 0;
                this.viewingPrevious = nextAnswered;
                this.practice0();
            } else {
                this.activity_Status = 'Completed';
                this.Time_elapsed = this.secondsToTime(this.timestart);
                this.resultShow = true;
                this.PracticeOne = false;
                this.ResultHide = true;

                const detailedResults = this.practiceList.map((entry, idx) => {
                    return {
                        questionNo: this.questionNoMap[idx] || idx + 1,
                        originalQuestionNo: entry.originalQuestionNo,
                        level: entry.level,
                        rectanglesAnswer: entry.rectanglesAnswer || [],
                        blanksAnswer: entry.blanksAnswer || [],
                        isCorrect: entry.isCorrect,
                        timeTaken: entry.timeTaken
                    };
                });

                this.resultData = {
                    summary: {
                        ActivityName: 'Sem4',
                        activityStatus: this.activity_Status,
                        totalTimeElapsed: this.timestart,
                        questionsAttempted: this.Questions_attempted,
                        correctAnswers: this.correct_Answers,
                        incorrectAnswers: this.incorrect_Answers,
                        attemptedQuestionNumbers: this.detailedResults.map(q => q.questionNo),
                        testDate: new Date().toISOString()
                    },
                    detailedResults
                };

                this.JsonArrData = JSON.stringify(this.resultData, null, 2);
            }
        },


          SaveAndExitNow() {
                  const questionId = this.counter + 1;

            const isBlanksQuestion = this.symbolsFromJson.length > 0 && this.iconBlanksFromJson.length > 0;
            const isRectangleQuestion = this.isRectangleMode && this.rectangles.length > 0 && this.options.length > 0;

            // ✅ Letter Fill Mode (Seaside)
            if (this.isLetterFillMode) {

                if (!this.currentQuestion || !this.currentQuestion.Blanks) {
                    return;
                }

                let allFilled = true;
                let allCorrect = true;

                for (const blank of this.currentQuestion.Blanks) {
                    let userAnswer = blank.firstSymbol || '';

                    if (blank["1stBlankValue"]) userAnswer += blank["1stBlankValue"];
                    if (blank["2ndBlankValue"]) userAnswer += blank["2ndBlankValue"];
                    if (blank["3rdBlankValue"]) userAnswer += blank["3rdBlankValue"];
                    if (blank["4thBlankValue"]) userAnswer += blank["4thBlankValue"];
                    if (blank["5thBlankValue"]) userAnswer += blank["5thBlankValue"];
                    if (blank["6thBlankValue"]) userAnswer += blank["6thBlankValue"];
                    if (blank["7thBlankValue"]) userAnswer += blank["7thBlankValue"];

                    if (blank.lastSymbol) userAnswer += blank.lastSymbol;

                    console.log(`Blank ${blank.id} → User: ${userAnswer} | Correct: ${blank.CorrectValue}`);

                    if (userAnswer.length < 2) {
                        allFilled = false;
                        break;
                    }

                    if (userAnswer !== blank.CorrectValue) {
                        allCorrect = false;
                    }
                }

                if (!allFilled) {
                    this.$toast ?.warning('Please fill all blanks before moving on.');
                    return;
                }

                const alreadyInList = this.practiceList.find(q => q.id === questionId);
                if (!alreadyInList) {
                    this.practiceList.push({
                        id: questionId,
                        blanksAnswer: JSON.parse(JSON.stringify(this.currentQuestion.Blanks)),
                        isCorrect: allCorrect,
                        originalQuestionNo: this.items[this.counter].__index,
                        level: this.items[this.counter].__level,
                        timeTaken: (Date.now() - this.questionStartTime) / 1000
                    });
                    this.Questions_attempted++;

                    if (allCorrect) {
                        this.correct_Answers++;
                        this.ProgressBar[this.counter].state = 'correct';
                    } else {
                        this.incorrect_Answers++;
                        this.ProgressBar[this.counter].state = 'incorrect';
                    }
                }
            } else if (isRectangleQuestion) {
                let allFilled = true;
                let allCorrect = true;

                for (const rect of this.rectangles) {
                    if (!rect.chosenOption) {
                        allFilled = false;
                        break;
                    }

                    if (typeof rect.chosenOption === 'string') {
                        if (rect.chosenOption !== rect.correctLetter) {
                            allCorrect = false;
                        }
                    } else {
                        if (rect.chosenOption.letter !== rect.correctLetter) {
                            allCorrect = false;
                        }
                    }
                }

                if (!allFilled) {
                    this.$toast ?.warning('Please match all rectangles before moving on.');
                    console.log("This is the print statement" + allFilled);
                    return;
                }

                const alreadyInList = this.practiceList.find(q => q.id === questionId);
                if (!alreadyInList) {
                    this.practiceList.push({
                        id: questionId,
                        rectanglesAnswer: JSON.parse(JSON.stringify(this.rectangles)),
                        isCorrect: allCorrect,
                        originalQuestionNo: this.items[this.counter].__index,
                        level: this.items[this.counter].__level,
                        timeTaken: (Date.now() - this.questionStartTime) / 1000
                    });
                    this.Questions_attempted++;

                    if (allCorrect) {
                        this.correct_Answers++;
                        this.ProgressBar[this.counter].state = 'correct';
                    } else {
                        this.incorrect_Answers++;
                        this.ProgressBar[this.counter].state = 'incorrect';
                    }
                }
            } else if (isBlanksQuestion) {

                const correctMap = this.iconBlanksFromJson.reduce((acc, b) => {
                    acc[b.id] = b.CorrectValue;
                    return acc;
                }, {});

                let allFilled = true;
                let allCorrect = true;

                for (const blank of this.iconBlanksFromJson) {
                    if (!blank.value) {
                        allFilled = false;
                        break;
                    }
                    const correctValue = correctMap[blank.id];
                    if (blank.value !== correctValue) {
                        allCorrect = false;
                    }
                }

                if (!allFilled) {
                    this.$toast ?.warning('Please fill all blanks before moving on.');
                    return;
                }

                const alreadyInList = this.practiceList.find(q => q.id === questionId);
                if (!alreadyInList) {
                    this.practiceList.push({
                        id: questionId,
                        blanksAnswer: JSON.parse(JSON.stringify(this.iconBlanksFromJson)),
                        isCorrect: allCorrect,
                        originalQuestionNo: this.items[this.counter].__index,
                        level: this.items[this.counter].__level,
                        timeTaken: (Date.now() - this.questionStartTime) / 1000
                    });
                    this.Questions_attempted++;

                    if (allCorrect) {
                        this.correct_Answers++;
                        this.ProgressBar[this.counter].state = 'correct';
                    } else {
                        this.incorrect_Answers++;
                        this.ProgressBar[this.counter].state = 'incorrect';
                    }
                }
            } else {
                const hasAnswered = this.practiceList.some(q => q.id === questionId);

                if (!hasAnswered) {
                    this.$toast ?.warning('Please answer the question before moving on.');
                    return;
                }
            }

                this.activity_Status = 'Partially Completed';
                this.Time_elapsed = this.secondsToTime(this.timestart);
                this.resultShow = true;
                this.PracticeOne = false;
                this.ResultHide = true;

                let detailedResults = this.detailedResults;

                 console.log("Practice Lst dsfg"+JSON.stringify(this.practiceList, null, 2));
                  this.practiceList.forEach(entry => {
                      // Convert both to strings with leading zeros (2-digit format)
                      const entryQNo = String(entry.id).padStart(2, '0');

                      const alreadyExists = detailedResults.some(
                          item => String(item.questionNo).padStart(2, '0') === entryQNo
                      );

                      if (!alreadyExists) {
                          detailedResults.push({
                              questionNo: entryQNo,
                              originalQuestionNo: entry.originalQuestionNo,
                              level: entry.level,
                              rectanglesAnswer: entry.rectanglesAnswer || [],
                              blanksAnswer: entry.blanksAnswer || [],
                              isCorrect: entry.isCorrect,
                              timeTaken: entry.timeTaken
                          });
                      }
                  });

                this.resultData = {
                    summary: {
                        ActivityName: 'Sem4',
                        activityStatus: this.activity_Status,
                        totalTimeElapsed: this.timestart,
                        questionsAttempted: this.Questions_attempted,
                        correctAnswers: this.correct_Answers,
                        incorrectAnswers: this.incorrect_Answers,
                        attemptedQuestionNumbers: detailedResults.map(q => q.questionNo),
                        testDate: new Date().toISOString()
                    },
                    detailedResults
                };

                 console.log("this.resultData "+JSON.stringify(this.resultData , null, 2));

                this.JsonArrData = JSON.stringify(this.resultData, null, 2);
          },

        FinalResult() {
            const now = new Date()
            const testDate = now.toISOString()
            const fullResult = this.resultData || {}

            // ✅ Clear old attemptedQuestionData before saving new one
localStorage.removeItem('attemptedQuestionData')

 // ✅ Save attemptedQuestionNumbers to localStorage
    localStorage.setItem('attemptedQuestionData', JSON.stringify(fullResult, null, 2));

            const blob = new Blob([JSON.stringify(fullResult, null, 2)], {
                type: 'application/json'
            })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `Test_Result_${testDate}.json`
            a.click()
            URL.revokeObjectURL(url)
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
