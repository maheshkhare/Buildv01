// Helper Functions of Category 2

export function parseLevelRangeHelper(context, raw) {
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
}

export function TimerFunHelper(context) {
    setInterval(() => {
        if (context.timestart < 9999999999) context.timestart++;
    }, 1000);
}

export function secondsToTimeHelper(s, context) {
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
}

export function practice0Helper(context) {
    console.log("Called...............");
    context.TimerFun();
    context.resultShow = false;
    context.PracticeOne = true;

    context.questionStartTime = context.timestart;
    const current = context.questionSet[context.counter];

    context.ImageNames = current.image;

    const isAnswered = context.answeredState[context.counter];
    context.countcorrect = isAnswered ? 1 : 0;

    context.AnswerCheckShow = !isAnswered;
    context.NextQuestionShow = isAnswered;

    context.matchedImageMode = !!current.imageSet;

    if (current.imageSet) {
        // If it's an imageSet question (like matching)
        const userAnswer = context.CollectionResult.find(
            r => r.originalQuestionNo === context.counter + 1
        );

        const selectedIndices = userAnswer?.userResponse || [];

        context.commonNumArray = current.imageSet.map((item, i) => {
            let state = 'unselected';

            if (selectedIndices.includes(i)) {
                state = item.isCorrect ? 'correct' : 'incorrect';
            }

            return {
                index: i,
                state,
                Question: item.label,
                Answer: item.isCorrect ? 'Yes' : ''
            };
        });
    } else if (current.options) {
        // If it's a regular options question
        const userAnswer = context.CollectionResult.find(
            r => r.originalQuestionNo === context.counter + 1
        );

        const selectedIndex = Number(userAnswer?.userResponse) - 1; 

        context.commonNumArray = current.options.map((opt, i) => {
            let state = 'unselected';

            if (isAnswered && i === selectedIndex) {
                state = 'selected';
            }

            return {
                index: i,
                state,
                Question: opt.label,
                Answer: opt.isCorrect ? 'Yes' : ''
            };
        });
    } else {
        context.commonNumArray = [];
    }
}

export function WordsAnswerHelper(context, Answer, index) {
    if (!context.matchedImageMode) {
        // ✅ Regular word-based option → auto check on select
        context.commonNumArray.forEach(opt => {
            opt.state = 'unselected';
        });

        context.commonNumArray[index].state = 'selected';
        context.lastSelectedIndex = index;

        context.AnswerCheckShow = false;
        context.NextQuestionShow = true;
    } else {
        // ✅ IMAGE MATCH MODE unchanged
        const selectedIndex = context.selectedIndices.indexOf(index);

        if (selectedIndex > -1) {
            context.selectedIndices.splice(selectedIndex, 1);
            context.commonNumArray[index].state = 'unselected';
        } else {
            context.selectedIndices.push(index);
            context.commonNumArray[index].state = 'selected';
        }

        if (context.selectedIndices.length === 2) {
            const [i1, i2] = context.selectedIndices;
            const img1 = context.commonNumArray[i1];
            const img2 = context.commonNumArray[i2];

            const isMatch = img1.Question === img2.Question && img1.Answer === 'Yes' && img2.Answer === 'Yes';

            if (isMatch) {
                context.commonNumArray[i1].state = 'correct';
                context.commonNumArray[i2].state = 'correct';
                context.ProgressBar[context.TestProgressBar].state = 'correct';
                context.correct_Answers++;
            } else {
                context.commonNumArray[i1].state = 'incorrect';
                context.commonNumArray[i2].state = 'incorrect';
                context.ProgressBar[context.TestProgressBar].state = 'incorrect';
                context.incorrect_Answers++;
            }

            context.countcorrect = 1;
            context.answeredState[context.counter] = true;
            context.Questions_attempted++;
            context.TestProgressBar++;
            context.AnswerCheckShow = false;
            context.NextQuestionShow = true;


            context.CollectionResult.push({
                questionNo: context.questionNoMap[context.counter] || context.counter + 1,
                originalQuestionNo: context.questionSet[context.counter].id || context.counter + 1,
                level: context.questionSet[context.counter].level || 'Level1',
                userResponse: isMatch ? `${i1 + 1},${i2 + 1}` : 'Mismatch',
                fullCorrectAnswer: context.commonNumArray.map(opt => opt.Answer),
                timeTaken: (context.timestart - context.questionStartTime) ?? 0.0
            });

            context.selectedIndices = [];
        }
    }
}

export function AnswerCheckHelper(context) {
    if (!context.matchedImageMode) {
        if (context.countcorrect === 0) {
            const index = context.lastSelectedIndex;

            if (index === undefined) {
                alert('Please select an option first!');
                return;
            }

            const Answer = context.commonNumArray[index].Answer;
            const isCorrect = Answer === 'Yes';

            context.countcorrect = 1; // ✅ mark context question as checked
            context.TestProgressBar++;
            context.ProgressBar[context.TestProgressBar - 1].state = isCorrect ? 'correct' : 'incorrect';
            context.commonNumArray[index].state = isCorrect ? 'correct' : 'incorrect';

            if (isCorrect) {
                context.correct_Answers++;
            } else {
                context.incorrect_Answers++;
            }

            context.answeredState[context.counter] = true;

            context.Questions_attempted++;

            context.CollectionResult.push({
                questionNo: context.questionNoMap[context.counter] || context.Questions_attempted + 1,
                originalQuestionNo: context.questionSet[context.counter].id || context.counter + 1,
                level: context.questionSet[context.counter].level || 'Level1',
                userResponse: (index + 1).toString(),
                fullCorrectAnswer: context.commonNumArray.map(opt => opt.Answer),
                timeTaken: (context.timestart - context.questionStartTime) ?? 0.0
            });

            context.AnswerCheckShow = false;
            context.NextQuestionShow = true;
        }
    }
    // Matching mode is handled inline already
}

export function NextQuestionHelper(context) {
    if (!context.answeredState[context.counter]) {
        // Finalize answer for word-based
        const index = context.lastSelectedIndex;
        if (index !== undefined) {
            const Answer = context.commonNumArray[index].Answer;
            const isCorrect = Answer === 'Yes';

            context.countcorrect = 1;
            context.TestProgressBar++;
            context.ProgressBar[context.TestProgressBar - 1].state = isCorrect ? 'correct' : 'incorrect';
            context.commonNumArray[index].state = isCorrect ? 'correct' : 'incorrect';

            if (isCorrect) context.correct_Answers++;
            else context.incorrect_Answers++;

            context.answeredState[context.counter] = true;
            context.Questions_attempted++;

            context.CollectionResult.push({
                questionNo: context.questionNoMap[context.counter] || context.Questions_attempted,
                originalQuestionNo: context.questionSet[context.counter].id || context.counter + 1,
                level: context.questionSet[context.counter].level || 'Level1',
                userResponse: (index + 1).toString(),
                fullCorrectAnswer: context.commonNumArray.map(opt => opt.Answer),
                timeTaken: (context.timestart - context.questionStartTime) ?? 0.0
            });
        }
    }

    // ✅ Then move next as normal
    if (context.counter < context.Total_Questions - 1) {
        context.counter++;
        context.countcorrect = 0;
        context.lastSelectedIndex = undefined;
        context.practice0();
    } else {
        context.activity_Status = 'Completed';
        context.Time_elapsed = context.secondsToTime(context.timestart);
        context.resultShow = true;
        context.PracticeOne = false;
        context.ResultHide = true;

        context.JsonArrData = JSON.stringify({
            ActivityStatus: context.activity_Status,
            TimeElapsed: context.Time_elapsed,
            QuestionsAttempted: context.Questions_attempted,
            CorrectAnswers: context.correct_Answers,
            IncorrectAnswers: context.incorrect_Answers,
            ExerciseNumber: context.exercise
        });
    }
}

export function SaveAndExitNowHelper(context) {
    if (!context.answeredState[context.counter]) {
        const index = context.lastSelectedIndex;
        if (index !== undefined) {
            const Answer = context.commonNumArray[index].Answer;
            const isCorrect = Answer === 'Yes';

            context.countcorrect = 1;
            context.TestProgressBar++;
            context.ProgressBar[context.TestProgressBar - 1].state = isCorrect ? 'correct' : 'incorrect';
            context.commonNumArray[index].state = isCorrect ? 'correct' : 'incorrect';

            if (isCorrect) context.correct_Answers++;
            else context.incorrect_Answers++;

            context.answeredState[context.counter] = true;
            context.Questions_attempted++;

            context.CollectionResult.push({
                questionNo: context.questionNoMap[context.counter] || context.Questions_attempted,
                originalQuestionNo: context.questionSet[context.counter].id || context.counter + 1,
                level: context.questionSet[context.counter].level || 'Level1',
                userResponse: (index + 1).toString(),
                fullCorrectAnswer: context.commonNumArray.map(opt => opt.Answer),
                timeTaken: (context.timestart - context.questionStartTime) ?? 0.0
            });
        }
    }

    // Mark status
    context.activity_Status = 'PartiallyCompleted';
    context.Time_elapsed = context.secondsToTime(context.timestart);

    context.resultShow = true;
    context.PracticeOne = false;
    context.ResultHide = true;

    context.JsonArrData = JSON.stringify({
        ActivityStatus: context.activity_Status,
        TimeElapsed: context.Time_elapsed,
        QuestionsAttempted: context.Questions_attempted,
        CorrectAnswers: context.correct_Answers,
        IncorrectAnswers: context.incorrect_Answers,
        ExerciseNumber: context.exercise
    });
}

export function FinalResultHelper(context) {
    const resultData = {
        summary: {
            ActivityName: "Sem2",
            activityStatus: context.activity_Status,
            totalTimeElapsed: context.timestart,
            questionsAttempted: context.Questions_attempted,
            correctAnswers: context.correct_Answers,
            attemptedQuestionNumbers: context.CollectionResult.map(q => q.questionNo),
            incorrectAnswers: context.incorrect_Answers,
            testDate: new Date().toISOString()
        },
        detailedResults: context.CollectionResult
    };

    // Download JSON
    const filename = `Lesson_${context.exercise}_Result.json`;
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
    const url = `${curSite}/solutions/Appfiles/cmActivityResult.aspx?TokenID=${sessionStorage.getItem('sesTokenID')}&JsonData=${context.CollectionResult}&Activityresult=${context.JsonArrData}&ExeID=${sessionStorage.getItem('ExeID')}&exNum=${sessionStorage.getItem('Exe_Number')}&studentID=${sessionStorage.getItem('studentID')}`;
    window.location.href = url;
}

// Helper Functions of Category 4

export function practice0Helper4(context) {
    if (context.items.length === 0) {
        context.TimerFun();
        context.AnswerCheckShow = true;
        context.PracticeOne = true;
        context.questionNoMap = [];

        const selectedItems = [];
        const levels = context.selectedLevels;
        const questionsPerLevel = Math.floor(context.Total_Questions / levels.length);
        let remaining = context.Total_Questions % levels.length;

        for (const level of levels) {
            const levelKey = `Level${level}`;
            const levelItems = context.activityQuestions[levelKey] || [];
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

        context.items = selectedItems;
    }

    if (context.counter >= context.items.length) return;

    const questionObj = context.items[context.counter];

    // If you stored the whole level key
    const levelKey = context.items[context.counter].__level;
    context.instructionText = context.activityQuestions[levelKey][0].Instruction || '';

    const questionKey = Object.keys(questionObj).find(k => k.startsWith('QuestionArr_'));

    if (questionKey) {
        const questionNum = questionKey.replace('QuestionArr_', '');
        context.questionNoMap.push(questionNum);
        console.log("Stored Question No: ", context.questionNoMap);
    }
    const optionKey = Object.keys(questionObj).find(k => k.startsWith('OptionArr_'));
    const answerKey = Object.keys(questionObj).find(k => k.startsWith('AnswerArr_'));

    context.questionStartTime = Date.now();

    if (
        questionObj.rectangles &&
        questionObj.options &&
        questionObj.rectangles.length > 0 &&
        questionObj.options.length > 0
    ) {
        context.rectangles = questionObj.rectangles;
        context.options = questionObj.options;
        context.isRectangleMode = true;

        context.paragraphText = questionObj[questionKey] || '';
        context.selectedRectangleIndex = 0;

        context.symbolsFromJson = [];
        context.iconBlanksFromJson = [];
        context.commonNumArray = [];

        return;
    } else {
        context.isRectangleMode = false;
    }

    // ✅ Normal paragraph text
    context.paragraphText = questionObj[questionKey] || '';

    const symbols = questionObj.Symbols || [];
    const blanks = questionObj.Blanks || [];

    context.symbolsFromJson = symbols;
    context.iconBlanksFromJson = blanks;

    if (blanks.length > 0) {
        context.selectedIconBox = blanks[0].id;
        context.selectedIconBoxIndex = 0;
    } else {
        context.selectedIconBox = null;
        context.selectedIconBoxIndex = 0;
    }

    // 🟢 Is it blanks question?
    const isBlanksQuestion = symbols.length > 0 && blanks.length > 0;

    if (isBlanksQuestion) {
        context.commonNumArray = [{
            Question: questionObj[questionKey] || '',
            Option: [],
            Answer: []
        }];
    } else {
        const QuestionValue = questionObj[questionKey] || '';
        const OptionValue = questionObj[optionKey] || [];
        let AnswerValue = questionObj[answerKey] || [];

        if (!Array.isArray(AnswerValue)) AnswerValue = [];

        context.commonNumArray = OptionValue.map((opt, i) => {
            return {
                index: i,
                state: 'base',
                Answer: AnswerValue[i],
                Option: opt,
                Question: QuestionValue
            };
        });
    }

    context.PrevQuestionShow = context.counter > 0;
}

export function WordsAnswerHelper4(context, Answer, index) {
    const questionId = context.counter + 1
    if (context.viewingPrevious) {
        alert("You have already answered context question. context cannot be changed now.")
        return
    }

    const currentQuestionObj = context.items[context.counter]
    const paddedIndex = context.getPaddedIndex(currentQuestionObj.__index)

    let correctAnswerArr = currentQuestionObj[`AnswerArr_${paddedIndex}`] || []
    if (!Array.isArray(correctAnswerArr)) correctAnswerArr = []

    const timeTaken = (Date.now() - context.questionStartTime) / 1000

    const existingIndex = context.practiceList.findIndex(q => q.id === questionId)
    if (existingIndex !== -1) {
        const old = context.practiceList[existingIndex]
        const wasCorrect = old.fullCorrectAnswer[old.userAnswer - 1] === 'Yes'
        if (wasCorrect) context.correct_Answers--
        else context.incorrect_Answers--

        context.practiceList.splice(existingIndex, 1)
    } else {
        context.Questions_attempted++
    }

    context.practiceList.push({
        id: questionId,
        originalQuestionNo: currentQuestionObj.__index,
        level: currentQuestionObj.__level,
        userAnswer: (index + 1).toString(),
        fullCorrectAnswer: correctAnswerArr,
        timeTaken
    })

    const isCorrect = correctAnswerArr[index] === 'Yes'

    if (isCorrect) {
        context.correct_Answers++
        context.ContinuesWrong = 0
        context.ProgressBar[context.counter].state = 'correct'
    } else {
        context.incorrect_Answers++
        context.ContinuesWrong++
        context.ProgressBar[context.counter].state = 'incorrect'
    }

    context.commonNumArray.forEach((opt, i) => {
        opt.state = i === index ?
            isCorrect ? 'correct' : 'incorrect' :
            'base'
    })

    context.countcorrect = 1

    if (context.counter + 1 > context.TestProgressBar) {
        context.TestProgressBar = context.counter + 1
    }
}

export function AnswerCheckHelper4(context) {
    const questionId = context.counter + 1;

    const isBlanksQuestion = context.symbolsFromJson.length > 0 && context.iconBlanksFromJson.length > 0;
    const isRectangleQuestion = context.isRectangleMode && context.rectangles.length > 0 && context.options.length > 0;

    // ✅ Letter Fill Mode (Seaside)
    if (context.isLetterFillMode) {

        if (!context.currentQuestion || !context.currentQuestion.Blanks) {
            return;
        }

        let allFilled = true;
        let allCorrect = true;

        for (const blank of context.currentQuestion.Blanks) {
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
            context.$toast?.warning('Please fill all blanks before moving on.');
            return;
        }

        const alreadyInList = context.practiceList.find(q => q.id === questionId);
        if (!alreadyInList) {
            context.practiceList.push({
                id: questionId,
                blanksAnswer: JSON.parse(JSON.stringify(context.currentQuestion.Blanks)),
                isCorrect: allCorrect,
                originalQuestionNo: context.items[context.counter].__index,
                level: context.items[context.counter].__level,
                timeTaken: (Date.now() - context.questionStartTime) / 1000
            });
            context.Questions_attempted++;

            if (allCorrect) {
                context.correct_Answers++;
                context.ProgressBar[context.counter].state = 'correct';
            } else {
                context.incorrect_Answers++;
                context.ProgressBar[context.counter].state = 'incorrect';
            }
        }
    } else if (isRectangleQuestion) {
        let allFilled = true;
        let allCorrect = true;

        for (const rect of context.rectangles) {
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
            context.$toast?.warning('Please match all rectangles before moving on.');
            console.log("context is the print statement" + allFilled);
            return;
        }

        const alreadyInList = context.practiceList.find(q => q.id === questionId);
        if (!alreadyInList) {
            context.practiceList.push({
                id: questionId,
                rectanglesAnswer: JSON.parse(JSON.stringify(context.rectangles)),
                isCorrect: allCorrect,
                originalQuestionNo: context.items[context.counter].__index,
                level: context.items[context.counter].__level,
                timeTaken: (Date.now() - context.questionStartTime) / 1000
            });
            context.Questions_attempted++;

            if (allCorrect) {
                context.correct_Answers++;
                context.ProgressBar[context.counter].state = 'correct';
            } else {
                context.incorrect_Answers++;
                context.ProgressBar[context.counter].state = 'incorrect';
            }
        }
    } else if (isBlanksQuestion) {

        const correctMap = context.iconBlanksFromJson.reduce((acc, b) => {
            acc[b.id] = b.CorrectValue;
            return acc;
        }, {});

        let allFilled = true;
        let allCorrect = true;

        for (const blank of context.iconBlanksFromJson) {
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
            context.$toast?.warning('Please fill all blanks before moving on.');
            return;
        }

        const alreadyInList = context.practiceList.find(q => q.id === questionId);
        if (!alreadyInList) {
            context.practiceList.push({
                id: questionId,
                blanksAnswer: JSON.parse(JSON.stringify(context.iconBlanksFromJson)),
                isCorrect: allCorrect,
                originalQuestionNo: context.items[context.counter].__index,
                level: context.items[context.counter].__level,
                timeTaken: (Date.now() - context.questionStartTime) / 1000
            });
            context.Questions_attempted++;

            if (allCorrect) {
                context.correct_Answers++;
                context.ProgressBar[context.counter].state = 'correct';
            } else {
                context.incorrect_Answers++;
                context.ProgressBar[context.counter].state = 'incorrect';
            }
        }
    } else {
        const hasAnswered = context.practiceList.some(q => q.id === questionId);

        if (!hasAnswered) {
            context.$toast?.warning('Please answer the question before moving on.');
            return;
        }
    }

    // ✅ ✅ ✅ Next or Complete
    if (context.counter < context.Total_Questions - 1) {
        context.counter++;
        const nextAnswered = context.practiceList.some(q => q.id === context.counter + 1);
        context.countcorrect = nextAnswered ? 1 : 0;
        context.viewingPrevious = nextAnswered;
        context.practice0();
    } else {
        context.activity_Status = 'Completed';
        context.Time_elapsed = context.secondsToTime(context.timestart);
        context.resultShow = true;
        context.PracticeOne = false;
        context.ResultHide = true;

        const detailedResults = context.practiceList.map((entry, idx) => {
            return {
                questionNo: context.questionNoMap[idx] || idx + 1,
                originalQuestionNo: entry.originalQuestionNo,
                level: entry.level,
                rectanglesAnswer: entry.rectanglesAnswer || [],
                blanksAnswer: entry.blanksAnswer || [],
                isCorrect: entry.isCorrect,
                timeTaken: entry.timeTaken
            };
        });

        context.resultData = {
            summary: {
                ActivityName: 'Sem4',
                activityStatus: context.activity_Status,
                totalTimeElapsed: context.timestart,
                questionsAttempted: context.Questions_attempted,
                correctAnswers: context.correct_Answers,
                incorrectAnswers: context.incorrect_Answers,
                attemptedQuestionNumbers: context.detailedResults.map(q => q.questionNo),
                testDate: new Date().toISOString()
            },
            detailedResults
        };

        context.JsonArrData = JSON.stringify(context.resultData, null, 2);
    }
}

export function SaveAndExitNowHelper4(context) {
    const questionId = context.counter + 1;

    const isBlanksQuestion = context.symbolsFromJson.length > 0 && context.iconBlanksFromJson.length > 0;
    const isRectangleQuestion = context.isRectangleMode && context.rectangles.length > 0 && context.options.length > 0;

    // ✅ Letter Fill Mode (Seaside)
    if (context.isLetterFillMode) {

        if (!context.currentQuestion || !context.currentQuestion.Blanks) {
            return;
        }

        let allFilled = true;
        let allCorrect = true;

        for (const blank of context.currentQuestion.Blanks) {
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
            context.$toast?.warning('Please fill all blanks before moving on.');
            return;
        }

        const alreadyInList = context.practiceList.find(q => q.id === questionId);
        if (!alreadyInList) {
            context.practiceList.push({
                id: questionId,
                blanksAnswer: JSON.parse(JSON.stringify(context.currentQuestion.Blanks)),
                isCorrect: allCorrect,
                originalQuestionNo: context.items[context.counter].__index,
                level: context.items[context.counter].__level,
                timeTaken: (Date.now() - context.questionStartTime) / 1000
            });
            context.Questions_attempted++;

            if (allCorrect) {
                context.correct_Answers++;
                context.ProgressBar[context.counter].state = 'correct';
            } else {
                context.incorrect_Answers++;
                context.ProgressBar[context.counter].state = 'incorrect';
            }
        }
    } else if (isRectangleQuestion) {
        let allFilled = true;
        let allCorrect = true;

        for (const rect of context.rectangles) {
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
            context.$toast?.warning('Please match all rectangles before moving on.');
            console.log("context is the print statement" + allFilled);
            return;
        }

        const alreadyInList = context.practiceList.find(q => q.id === questionId);
        if (!alreadyInList) {
            context.practiceList.push({
                id: questionId,
                rectanglesAnswer: JSON.parse(JSON.stringify(context.rectangles)),
                isCorrect: allCorrect,
                originalQuestionNo: context.items[context.counter].__index,
                level: context.items[context.counter].__level,
                timeTaken: (Date.now() - context.questionStartTime) / 1000
            });
            context.Questions_attempted++;

            if (allCorrect) {
                context.correct_Answers++;
                context.ProgressBar[context.counter].state = 'correct';
            } else {
                context.incorrect_Answers++;
                context.ProgressBar[context.counter].state = 'incorrect';
            }
        }
    } else if (isBlanksQuestion) {

        const correctMap = context.iconBlanksFromJson.reduce((acc, b) => {
            acc[b.id] = b.CorrectValue;
            return acc;
        }, {});

        let allFilled = true;
        let allCorrect = true;

        for (const blank of context.iconBlanksFromJson) {
            if (!blank.value) {
                allFilled = false;
                break;
            }
            const correctValue = correctMap[blank.id];
            if (blank.value !== correctValue) {
                allCorrect = false;
            }
        }

        // if (!allFilled) {
        //     context.$toast?.warning('Please fill all blanks before moving on.');
        //     return;
        // }

        const alreadyInList = context.practiceList.find(q => q.id === questionId);
        if (!alreadyInList) {
            context.practiceList.push({
                id: questionId,
                blanksAnswer: JSON.parse(JSON.stringify(context.iconBlanksFromJson)),
                isCorrect: allCorrect,
                originalQuestionNo: context.items[context.counter].__index,
                level: context.items[context.counter].__level,
                timeTaken: (Date.now() - context.questionStartTime) / 1000
            });
            context.Questions_attempted++;

            if (allCorrect) {
                context.correct_Answers++;
                context.ProgressBar[context.counter].state = 'correct';
            } else {
                context.incorrect_Answers++;
                context.ProgressBar[context.counter].state = 'incorrect';
            }
        }
    } else {
        const hasAnswered = context.practiceList.some(q => q.id === questionId);

        if (!hasAnswered) {
            context.$toast?.warning('Please answer the question before moving on.');
            return;
        }
    }

    context.activity_Status = 'Partially Completed';
    context.Time_elapsed = context.secondsToTime(context.timestart);
    context.resultShow = true;
    context.PracticeOne = false;
    context.ResultHide = true;

    let detailedResults = context.detailedResults;

    console.log("Practice Lst dsfg" + JSON.stringify(context.practiceList, null, 2));
    context.practiceList.forEach(entry => {
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

    context.resultData = {
        summary: {
            ActivityName: 'Sem4',
            activityStatus: context.activity_Status,
            totalTimeElapsed: context.timestart,
            questionsAttempted: context.Questions_attempted,
            correctAnswers: context.correct_Answers,
            incorrectAnswers: context.incorrect_Answers,
            attemptedQuestionNumbers: detailedResults.map(q => q.questionNo),
            testDate: new Date().toISOString()
        },
        detailedResults
    };

    console.log("context.resultData " + JSON.stringify(context.resultData, null, 2));

    context.JsonArrData = JSON.stringify(context.resultData, null, 2);
}

export function FinalResultHelper4(context) {
    const now = new Date()
    const testDate = now.toISOString()
    const fullResult = context.resultData || {}

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
}

// Templates generic methods
export function handleDropInParagraphHelper(context,blankId, event) {
  const raw = event.dataTransfer.getData('application/json') || event.dataTransfer.getData('text/plain');
  if (!raw) return;

  let dropped;
  try { dropped = JSON.parse(raw); } catch (e) { dropped = { symbol: raw }; }
  
  const valueToSet = dropped.value ?? dropped.symbol ?? String(raw);

  const idx = context.iconBlanks.findIndex(b => b.id === blankId);
  if (idx !== -1) {
    context.$set(context.iconBlanks, idx, { ...context.iconBlanks[idx], value: valueToSet });
  }
}

 export function assignOptionToRectangleHelper(context,opt) {
  if (context.selectedRectangleIndex === null) {
    alert('Please select a rectangle first.');
    return;
  }
  const currentRect = context.rectangles[context.selectedRectangleIndex];

  // ✅ DO NOT overwrite if already filled
  if (currentRect.chosenOption) {
    alert('context rectangle already has a letter.');
    return;
  }

  // ✅ Assign the option
  context.$set(context.rectangles, context.selectedRectangleIndex, {
    ...currentRect,
    chosenOption: opt
  });

  // ✅ Find next empty rectangle
  const nextIdx = context.rectangles.findIndex(
    (r, i) => !r.chosenOption && i > context.selectedRectangleIndex
  );

  if (nextIdx !== -1) {
    context.selectedRectangleIndex = nextIdx;
  } else {
    context.selectedRectangleIndex = null; // all filled
  }
}

export function getImgUrlHelper(context,ImgName) {
            if (!ImgName) return "";
            var images = require.context('../assets/graphicsCat4/', false, /\.png$/);
            return images('./' + ImgName + ".png");
        }

export function getImgUrlByFileNameHelper(context,ImgName) {
  try {
    const fileName = sessionStorage.getItem('jsonFile');
    const images = require.context('../assets/graphicsCat4/', true, /\.png$/);
    const path = `./${fileName}/${ImgName}.png`;
    return images(path); // If it succeeds, return image path
  } catch (error) {
    return null; // If not an image, return null
  }
}

// export function getBlankKeyHelper(context,n) {
//   if (n === 1) return '1stBlankValue';
//   if (n === 2) return '2ndBlankValue';
//   if (n === 3) return '3rdBlankValue';
//   if (n === 4) return '4thBlankValue';
//   if (n === 2) return '5thBlankValue';
//   if (n === 3) return '6thBlankValue';
//   if (n === 4) return '7thBlankValue';
//   return `${n}thBlankValue`;
// }


export function getBlankKeyHelper(context,n) {
  const suffix = (n) => {
    if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  };
  return `${suffix(n)}BlankValue`;
}


export function assignLetterHelper(context,letter) {
  if (!context.selectedBlankId) {
    alert('Please select a blank first.');
    return;
  }

  const blankIdx = context.blanks.findIndex(b => b.id === context.selectedBlankId);
  const key = context.getBlankKey(context.selectedBlankIndex);
  context.$set(context.blanks[blankIdx], key, letter);

  // 🔁 Auto-select next blank in the same group (same ID)
  const nextIndex = context.selectedBlankIndex + 1;
  const nextKey = context.getBlankKey(nextIndex);
  if (context.blanks[blankIdx][nextKey] !== undefined) {
    context.selectedBlankId = context.selectedBlankId;
    context.selectedBlankIndex = nextIndex;
  } else {
    // ❌ No more blanks in current group: clear selection
    context.selectedBlankId = null;
    context.selectedBlankIndex = null;
  }
}






///////////////////////////////cat 1 /////////////////////////////




 export function processWordSetshelper(context) {
      context.wordSets = {};
      context.levelNames = {};

      const selectedLevels = context.parseLevelRange(context.Exercise_Number);
      let questionLimit = context.questionLimit || 1;

      let totalAvailable = 0;
      selectedLevels.forEach(level => {
        const levelKey = `level${level}`;
        const sets = (context.activityQuestions.sets && context.activityQuestions.sets[levelKey]) || [];
        totalAvailable += sets.length;
      });

      if (totalAvailable < questionLimit) {
        
      }

      let combinedSets = [];
      selectedLevels.forEach(level => {
        const levelKey = `level${level}`;
        const sets = (context.activityQuestions.sets && context.activityQuestions.sets[levelKey]) || [];
        combinedSets.push(...sets.map(set => ({ ...set, __level: levelKey })));
      });

      combinedSets = combinedSets.sort(() => Math.random() - 0.5);

      const selectedSets = combinedSets.slice(0, questionLimit);

      context.allSelectedSets = selectedSets;

      context.wordSets = selectedSets.reduce((acc, set) => {
        const key = set.__level || 'level1';
        if (!acc[key]) acc[key] = [];
        acc[key].push(set);
        return acc;
      }, {});

      selectedLevels.forEach(level => {
        const levelKey = `level${level}`;
        context.levelNames[level] = context.wordSets[levelKey]?.[0]?.levelName || `Level ${level}`;
      });

      context.Total_Questions = questionLimit;
    }


    export function initializeComponenthelper(context) {
      const activityName = sessionStorage.getItem("ActivityName");
      context.language = sessionStorage.getItem("lang") || 'en';

      const firstLevel = context.parseLevelRange(context.Exercise_Number)[0];
      context.exercise = parseInt(firstLevel) || 1;
      const levelKey = context.getLevelKey(firstLevel);
      const currentSets = context.wordSets[levelKey];
      const levelName = currentSets?.[0]?.levelName || context.levelNames[firstLevel] || `Level ${firstLevel}`;
      context.componentSubtitle = levelName;

      context.run();
      context.TimerFun();
      context.isLoading = false;
    }


   export function  initializeExercisehelper1(context,exerciseNum) {
      context.Questions_attempted = 0;
      context.correct_Answers = 0;
      context.incorrect_Answers = 0;
      context.questionTimings = [];
      context.questionDetails = [];
      context.reset();
      context.questionStates = [];
      context.currentQuestionIndex = 0;
      context.setcount = 0;
      context.Exercise_Number = exerciseNum;
      context.Total_Questions = context.currentExerciseSets.length;
      if (context.currentExerciseSets.length > 0) {
        context.displayWords();
      }
    }


     export function  loadQuestionDatahelper(context,currentSet) {
      context.reset();
      context.Arrow_isShowing = false;
      context.truenextgame = false;
      context.columnTitles = currentSet.categories.map(cat => 
        cat.displayName || cat.name || ''
      );
      context.columnVisibility = currentSet.categories.map(() => !context.isSingleColumnMode);
      context.wordsarr = [];
      currentSet.categories.forEach(category => {
        if (category?.words) {
          context.wordsarr = [...context.wordsarr, ...category.words];
        }
      });
      context.wordsarr = context.shuffleArray(context.wordsarr);
      context.availableWords = [...context.wordsarr];
      context.placedWords = [];
      context.selectedWord = null;
      const maxWords = context.isSingleColumnMode
        ? currentSet.categories[0].words.length 
        : Math.max(...currentSet.categories.map(cat => cat.words.length));
      const columnLength = Math.max(8, Math.ceil(maxWords * 1.2));
      context.columns = currentSet.categories.map(() => 
        context.createEmptyColumn(columnLength)
      );
      context.counts = currentSet.categories.map(() => 0);
      if (context.isSingleColumnMode) {
        context.columnTitles = [context.columnTitles[0]];
        context.columnVisibility = [true];
        context.columns = [context.columns[0]];
        context.Arrow_isShowing = true;
      }
    }

    export function createEmptyColumnhelper(count) {
      return Array(count).fill().map((_, i) => ({
        shape: 'square',
        index: i,
        size: 'xl',
        width: 'wide',
        height: 'normal',
        color: 'white',
        name: '',
        state: 'base'
      }));
    }

    export function resethelper(context) {
      context.wordsarr = [];
      context.count = 0;
      context.placedWords = [];
      context.selectedWord = null;
      context.Arrow_isShowing = false;
      context.columns.forEach(column => {
        column.forEach(item => {
          item.name = '';
          item.state = 'base';
        });
      });
    }

     export function shuffleArrayhelper1(array) {
      let counter = array.length, temp, index;
      while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }
      return array;
    }


     export function TimerFunhelper1(context) {
      context.timerInterval = setInterval(() => {
        if (context.timestart <= 9999999999) {
          context.timestart += 1;
        }
      }, 1000);
    }

     export function secondsToTimehelper1(totalSeconds) {
      const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
      const m = Math.floor(totalSeconds % 3600 / 60).toString().padStart(2, '0');
      const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    }

    export function  runhelper1(context) {
      if (Object.keys(context.wordSets).length > 0) {
        if (context.mode === 'instruction') {
          context.InstructionShow = true;
        } else {
          context.practice0();
        }
      } else {
        console.log('Waiting for data to load...');
      }
    }

   export function practice0helper1( context) {
      context.InstructionShow = false;
      context.showtop = true;
      context.displayWords();
    }
 export function PracticeNexthelper1(context) {
      context.InstructionShow = false;
      context.practice0();
    }

    export function displayWordshelper1(context) {
      context.showtop = true;
      context.showBottom = true;
      context.startQuestionTracking();
      if (!context.currentExerciseSets || context.currentExerciseSets.length === 0) {
        console.error('No exercise sets available');
        return;
      }
      const currentSet = context.currentExerciseSets[context.currentQuestionIndex];
      if (!currentSet || !currentSet.categories) {
        console.error('Current set not found or has no categories');
        return;
      }
      if (!context.questionStates[context.currentQuestionIndex]) {
        context.loadQuestionData(currentSet);
        context.canModifyAnswers = true;
      } else {
        context.loadQuestionState(context.currentQuestionIndex);
        context.canModifyAnswers = context.currentQuestionIndex >= context.setcount;
        if (!context.canModifyAnswers) {
          context.markAllAnswersAsReadonly();
        }
      }
      context.SetTotal = context.wordsarr.length;
      context.resultShow = false;
    }

      export function goToPreviousQuestionhelper1(context) {
      context.recordQuestionTime();
      if (context.currentQuestionIndex > 0) {
        context.saveQuestionState();
        context.currentQuestionIndex--;
        context.canModifyAnswers = context.currentQuestionIndex >= context.setcount;
        context.loadQuestionState(context.currentQuestionIndex);
        if (!context.canModifyAnswers) {
          context.markAllAnswersAsReadonly();
        }
        if (context.isReviewMode) {
          context.currentReviewIndex = context.currentQuestionIndex;
        }
        context.truenextgame = true;
        context.Arrow_isShowing = context.questionStates[context.currentQuestionIndex]?.Arrow_isShowing || false;
        context.startQuestionTimer();
        context.isShowing_info = false;
        context.resultShow = false;
      }
    }

       export function goToNextQuestionhelper1(context) {
      const isCorrect = context.checkCompletion(false);
      context.updateQuestionTracking(isCorrect);
      if (context.currentQuestionIndex < context.currentExerciseSets.length - 1) {
        context.saveQuestionState();
        context.currentQuestionIndex++;
        const wasPreviouslyAnswered = context.currentQuestionIndex <= context.setcount;
        context.canModifyAnswers = !wasPreviouslyAnswered ||
              (context.questionStates[context.currentQuestionIndex]?.placedWords?.length < 
              context.questionStates[context.currentQuestionIndex]?.wordsarr?.length);
        if (wasPreviouslyAnswered) {
          context.loadQuestionState(context.currentQuestionIndex);
          if (!context.canModifyAnswers) {
            context.markAllAnswersAsReadonly();
          }
        } else {
          context.setcount = context.currentQuestionIndex;
          context.reset();
          const currentSet = context.currentExerciseSets[context.currentQuestionIndex];
          context.loadQuestionData(currentSet);
        }
        context.Arrow_isShowing = context.placedWords.length === context.wordsarr.length;
        context.truenextgame = false;
      }
      context.startQuestionTimer();
    }

    export function markAllAnswersAsReadonlyhelper1( context) {
      context.columns.forEach(column => {
        column.forEach(item => {
          if (item.name) item.state = 'readonly';
        });
      });
    }

    export function checkCompletionhelper1( context,updateCounters = true) {
      const currentSet = context.currentExerciseSets[context.currentQuestionIndex];
      if (!currentSet || !currentSet.categories) return false;
      if (context.isSingleColumnMode) {
        const firstCategory = currentSet.categories[0];
        if (!firstCategory) return false;
        const correctWords = context.columns[0].filter(item => item.name && firstCategory.words.includes(item.name)).length;
        const isCorrect = correctWords === firstCategory.words.length;
        if (updateCounters) {
          if (isCorrect) context.correct_Answers++;
          else context.incorrect_Answers++;
          context.Questions_attempted++;
        }
        return isCorrect;
      } else {
        const isCorrect = currentSet.categories.every((category, index) => {
          if (index >= context.columns.length) return false;
          return context.columns[index].filter(item => 
            item.name && category.words.includes(item.name)
          ).length === category.words.length;
        });
        if (updateCounters) {
          if (isCorrect) context.correct_Answers++;
          else context.incorrect_Answers++;
          context.Questions_attempted++;
        }
        return isCorrect;
      }
    }


 export function Click_NextButtonhelper1(context) {
      context.Arrow_isShowing = false;
      context.isShowing_info = true;
      context.truenextgame = false;
      const isCorrect = context.checkCompletion();
      context.updateQuestionTracking(isCorrect);
      context.saveQuestionState();
      if (context.currentQuestionIndex < context.currentExerciseSets.length - 1) {
        context.goToNextQuestion();
      } else {
        context.showResults();
      }
    }

  export function  OnNewGame_Clickhelper1(context) {
      if (context.isReviewMode) {
        context.isReviewMode = false;
        context.currentReviewIndex = -1;
      }
      if (context.truenextgame === true) {
        context.truenextgame = false;
        context.goToNextQuestion();
      }
    }

export function updateAvailableWordshelper1(context) {
      const allWordsPlaced = context.wordsarr.length === context.placedWords.length;
      context.Arrow_isShowing = allWordsPlaced;
      context.canModifyAnswers = !allWordsPlaced;
      context.saveQuestionState();
    }

    export function  handleColumnClickhelper1( context,colIndex, itemIndex) {
      if (!context.canModifyAnswers) return;
      const column = context.columns[colIndex];
      const item = column[itemIndex];
      if (!item.name && context.selectedWord) {
        item.name = context.selectedWord;
        context.placedWords.push(context.selectedWord);
        const wordIndex = context.availableWords.indexOf(context.selectedWord);
        if (wordIndex > -1) context.availableWords.splice(wordIndex, 1);
        context.selectedWord = null;
        context.updateAvailableWords();
      } else if (item.name && !context.selectedWord) {
        const returnedWord = item.name;
        item.name = '';
        const placedIndex = context.placedWords.indexOf(returnedWord);
        if (placedIndex > -1) context.placedWords.splice(placedIndex, 1);
        context.availableWords.push(returnedWord);
        context.updateAvailableWords();
      }
    }

     export function saveQuestionStatehelper1(context) {
      context.questionStates[context.currentQuestionIndex] = {
        columns: JSON.parse(JSON.stringify(context.columns)),
        columnTitles: [...context.columnTitles],
        columnVisibility: [...context.columnVisibility],
        placedWords: [...context.placedWords],
        availableWords: [...context.availableWords],
        selectedWord: context.selectedWord,
        Arrow_isShowing: context.Arrow_isShowing,
        wordsarr: [...context.wordsarr],
        counts: [...context.counts],
        isCompleted: context.placedWords.length === context.wordsarr.length,
        wasModified: context.canModifyAnswers
      };
    }

     export function loadQuestionStatehelper1( context,index) {
      const state = context.questionStates[index];
      if (state) {
        context.columns = JSON.parse(JSON.stringify(state.columns));
        context.columnTitles = [...state.columnTitles];
        context.columnVisibility = [...state.columnVisibility];
        context.placedWords = [...state.placedWords];
        context.availableWords = [...state.availableWords];
        context.selectedWord = state.selectedWord;
        context.Arrow_isShowing = state.Arrow_isShowing;
        context.wordsarr = [...state.wordsarr];
        context.counts = [...state.counts];
        context.canModifyAnswers = state.wasModified;
        if (!context.canModifyAnswers) {
          context.markAllAnswersAsReadonly();
        }
      }
    }

       export function recordQuestionTimehelper1(context) {
      if (context.currentQuestionStartTime) {
        const timeTaken = Date.now() - context.currentQuestionStartTime;
        context.questionTimings[context.currentQuestionIndex] = timeTaken;
        context.currentQuestionStartTime = 0;
      }
    }

      export function updateQuestionTrackinghelper1( context,isCorrect) {
      if (context.currentQuestionStartTime) {
        const timeTaken = Date.now() - context.currentQuestionStartTime;
        context.questionTimings[context.currentQuestionIndex] = timeTaken;
        context.questionDetails[context.currentQuestionIndex] = {
          ...context.questionDetails[context.currentQuestionIndex],
          timeTaken: timeTaken,
          isCompleted: true,
          wasCorrect: isCorrect
        };
        context.currentQuestionStartTime = 0;
      }
    }
    

     export function startQuestionTrackinghelper1(context) {
      context.currentQuestionStartTime = Date.now();
      if (!context.questionDetails[context.currentQuestionIndex]) {
        const currentSet = context.currentExerciseSets[context.currentQuestionIndex];
        context.questionDetails[context.currentQuestionIndex] = {
          questionIndex: context.currentQuestionIndex,
          timeTaken: 0,
          isCompleted: false,
          wasCorrect: false,
          wasDisplayed: true,
          questionTitles: currentSet?.categories?.map(cat => cat.displayName || cat.name) || []
        };
      }
    }

export function  showResultshelper1(context) {
      context.activity_Status = "Completed";
      context.Time_elapsed = context.secondsToTime(context.timestart);
      context.timeInSeconds = context.timestart;
      context.resultShow = true;
      context.InstructionShow = false;
      context.isShowing_info = false;
      context.truenextgame = false;
      context.showtop = false;
      context.showBottom = false;
      context.ResultHide = true;
      context.ResultArrow = false;
      context.JsonArrData = JSON.stringify(context.generateResultsJson());
    }

    export function generateResultsJsonhelper1(context) {
      return {
        activityStatus: context.activity_Status,
        totalTime: context.timeInSeconds,
        questionTimings: context.questionTimings,
        questionsAttempted: context.Questions_attempted,
        correctAnswers: context.correct_Answers,
        incorrectAnswers: context.incorrect_Answers,
        exerciseNumber: context.exercise,
        exerciseName: context.levelNames[context.exercise] || `Level ${context.exercise}`,
        totalQuestions: context.currentExerciseSets.length,
        displayedQuestions: context.questionDetails.filter(q => q.wasDisplayed).length,
        detailedResults: context.questionDetails
      };
    }

     export function downloadResultsJsonhelper1(context) {
      const data = context.generateResultsJson();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `classification_results_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

      export function  FinalResulthelper1(context ) {
      const curSite = window.location.protocol + "//" + window.location.host;
      const Url = `${curSite}/solutions/Appfiles/cmActivityResult.aspx?TokenID=${sessionStorage.getItem('sesTokenID')}&JsonData=${context.CollectionResult}&Activityresult=${context.JsonArrData}&ExeID=${sessionStorage.getItem('ExeID')}&exNum=${sessionStorage.getItem('Exe_Number')}&studentID=${sessionStorage.getItem('studentID')}`;
      window.location.href = Url;
    }




  ///////////////////////////////cat 3 /////////////////////////////


 export function  updateScreenSizehelper(context) {
      const width = window.innerWidth
      if (width < 640) {
        context.screenSize = 'sm'
      } else if (width < 1024) {
        context.screenSize = 'md'
      } else {
        context.screenSize = 'lg'
      }
    }

    export function getResponsiveImageHeighthelper3(context) {
      switch (context.screenSize) {
        case 'sm': return '120px'
        case 'md': return '150px'
        default: return '180px'
      }
    }

      export function getResponsiveImageWidthhelper3(context) {
      switch (context.screenSize) {
        case 'sm': return '200px'
        case 'md': return '250px'
        default: return '300px'
      }
    }

      export function getQuestionWordhelper3(question) {
      const key = Object.keys(question).find(k => k.startsWith('QuestionArr_'))
      // console.log('questions,',question)
      return key && question[key]?.[0] || ''
      
    }

     export function getGridLettershelper3(question) {
      const key = Object.keys(question).find(k => k.startsWith('OptionArr_'))
      return key ? question[key] : []
    }

    export function  getAnswerWordhelper(question) {
      const optionKey = Object.keys(question).find(k => k.startsWith('OptionArr_'))
      const answerKey = Object.keys(question).find(k => k.startsWith('AnswerArr_'))
      const options = optionKey ? question[optionKey] : []
      const answers = answerKey ? question[answerKey] : []
      if (!Array.isArray(answers) || !Array.isArray(options)) return ''
      return options.filter((_, i) => answers[i] === 'Yes').join('')
    }

     export function handleWordGridAnsweredhelper( context ,{ word, response }) {
      context.lastGridAnswer = { word, response }
      context.lockedForNext = false
      context.AnswerCheck()
    }

    // export function WordsAnswerhelper3(context,Answer, index) {
    //   const questionId = context.counter + 1
    //   if (context.viewingPrevious) {
    //     alert("You have already answered context question. context cannot be changed now.")
    //     return
    //   }
    //   const currentQuestionObj = context.items[context.counter]
    //   const answerKey = Object.keys(currentQuestionObj).find(k => k.startsWith('AnswerArr_'))
    //   let correctAnswerArr = answerKey ? currentQuestionObj[answerKey] : []
    //   if (!Array.isArray(correctAnswerArr)) correctAnswerArr = []

    //   const timeTaken = (Date.now() - context.questionStartTime) / 1000
    //   const existingIndex = context.practiceList.findIndex(q => q.id === questionId)
    //   if (existingIndex !== -1) {
    //     const old = context.practiceList[existingIndex]
    //     const wasCorrect = old.fullCorrectAnswer[old.userAnswer - 1] === 'Yes'
    //     if (wasCorrect) context.correct_Answers--
    //     else context.incorrect_Answers--
    //     context.practiceList.splice(existingIndex, 1)
    //   } else {
    //     context.Questions_attempted++
    //   }

    //   context.practiceList.push({
    //     id: questionId,
    //     originalQuestionNo: currentQuestionObj.__index,
    //     level: currentQuestionObj.__level,
    //     userAnswer: (index + 1).toString(),
    //     fullCorrectAnswer: correctAnswerArr,
    //     timeTaken,
    //   })

    //   const isCorrect = correctAnswerArr[index] === 'Yes'

    //   if (isCorrect) {
    //     context.correct_Answers++
    //     context.ContinuesWrong = 0
    //     context.ProgressBar[context.counter].state = 'correct'
    //   } else {
    //     context.incorrect_Answers++
    //     context.ContinuesWrong++
    //     context.ProgressBar[context.counter].state = 'incorrect'
    //   }
    //   context.commonNumArray.forEach((opt, i) => {
    //     opt.state = i === index ? (isCorrect ? 'correct' : 'incorrect') : 'base'
    //   })
    //   context.countcorrect = 1

    //   if (context.counter + 1 > context.TestProgressBar) {
    //     context.TestProgressBar = context.counter + 1
    //   }
    // }

export function WordsAnswerhelper3(context, Answer, index) {
  const questionId = context.counter + 1
  if (context.viewingPrevious) {
    alert("You have already answered this question. This cannot be changed now.")
    return
  }
  
  const currentQuestionObj = context.items[context.counter]
  
  // SAFETY CHECK
  if (!currentQuestionObj || typeof currentQuestionObj !== 'object') {
    console.error('Invalid question object in WordsAnswerhelper3')
    return
  }
  
  let answerKey
  try {
    answerKey = Object.keys(currentQuestionObj).find(k => k.startsWith('AnswerArr_'))
  } catch (e) {
    console.error('Error finding answer key:', e)
    return
  }
  
  let correctAnswerArr = answerKey ? currentQuestionObj[answerKey] : []
  if (!Array.isArray(correctAnswerArr)) correctAnswerArr = []

  // Rest of your existing logic...
  const timeTaken = (Date.now() - context.questionStartTime) / 1000
  const existingIndex = context.practiceList.findIndex(q => q.id === questionId)
  
  if (existingIndex !== -1) {
    const old = context.practiceList[existingIndex]
    const wasCorrect = old.fullCorrectAnswer[old.userAnswer - 1] === 'Yes'
    if (wasCorrect) context.correct_Answers--
    else context.incorrect_Answers--
    context.practiceList.splice(existingIndex, 1)
  } else {
    context.Questions_attempted++
  }

  context.practiceList.push({
    id: questionId,
    originalQuestionNo: currentQuestionObj.__index,
    level: currentQuestionObj.__level,
    userAnswer: (index + 1).toString(),
    fullCorrectAnswer: correctAnswerArr,
    timeTaken,
  })

  const isCorrect = correctAnswerArr[index] === 'Yes'

  if (isCorrect) {
    context.correct_Answers++
    context.ContinuesWrong = 0
    context.ProgressBar[context.counter].state = 'correct'
  } else {
    context.incorrect_Answers++
    context.ContinuesWrong++
    context.ProgressBar[context.counter].state = 'incorrect'
  }
  
  context.commonNumArray.forEach((opt, i) => {
    opt.state = i === index ? (isCorrect ? 'correct' : 'incorrect') : 'base'
  })
  context.countcorrect = 1

  if (context.counter + 1 > context.TestProgressBar) {
    context.TestProgressBar = context.counter + 1
  }
}



     export function  AnswerCheckhelper3( context) {
      if (context.jsonFileName === 'CSR-I') {
        if (!context.lastGridAnswer) {
          context.$toast?.warning('Please select your answer first.');
          return;
        }
        const questionId = context.counter + 1;
        const currentQuestionObj = context.currentQuestion;

        const answerKey = Object.keys(currentQuestionObj).find(k => k.startsWith('AnswerArr_'));
        let correctAnswerArr = answerKey ? currentQuestionObj[answerKey] : [];
        if (!Array.isArray(correctAnswerArr)) correctAnswerArr = [];

        const userWord = context.lastGridAnswer.word;
        const userResponse = context.lastGridAnswer.response;

        let isOppositeValid = currentQuestionObj.IsOppositeValid;
        let isCorrect = (
          (isOppositeValid && userResponse === 'yes') ||
          (!isOppositeValid && userResponse === 'no')
        );

        context.practiceList.push({
          id: questionId,
          originalQuestionNo: currentQuestionObj.__index,
          level: currentQuestionObj.__level,
          userAnswer: userWord,
          userClicked: userResponse,
          fullCorrectAnswer: correctAnswerArr,
          timeTaken: (Date.now() - context.questionStartTime) / 1000,
        });

        if (isCorrect) {
          context.correct_Answers++;
          context.ContinuesWrong = 0;
          context.ProgressBar[context.counter].state = 'correct';
        } else {
          context.incorrect_Answers++;
          context.ContinuesWrong++;
          context.ProgressBar[context.counter].state = 'incorrect';
        }
        context.Questions_attempted++;
        context.countcorrect = 1;
        context.lockedForNext = true;
        context.lastGridAnswer = null;

        if (context.counter < context.Total_Questions - 1) {
          context.counter++;
          context.practice0();
        } else {
          context.activity_Status = 'Completed';
          context.Time_elapsed = context.secondsToTime(context.timestart);
          context.resultShow = true;
          context.PracticeOne = false;
          context.ResultHide = true;
        }

        return;
      }

      const questionId = context.counter + 1;
      const hasAnswered = context.practiceList.some(q => q.id === questionId);

      if (!hasAnswered) {
        context.$toast?.warning('Please answer the question before moving on.');
        return;
      }

      if (context.counter < context.Total_Questions - 1) {
        context.counter++;
        const nextAnswered = context.practiceList.some(q => q.id === context.counter + 1);
        context.countcorrect = nextAnswered ? 1 : 0;
        context.viewingPrevious = nextAnswered;
        context.practice0();
      } else {
        context.activity_Status = 'Completed';
        context.Time_elapsed = context.secondsToTime(context.timestart);
        context.resultShow = true;
        context.PracticeOne = false;
        context.ResultHide = true;

        const detailedResults = context.practiceList.map((entry, idx) => {
          const levelKey = entry.level;
          const origIdx = entry.originalQuestionNo;
          const sourceQ = context.activityQuestions[levelKey]?.[origIdx] || {};
          const ansKey = Object.keys(sourceQ).find(k => k.startsWith('AnswerArr_'));
          const correctArr = Array.isArray(sourceQ[ansKey]) ? sourceQ[ansKey] : [];

          return {
            questionNo: idx + 1,
            originalQuestionNo: origIdx,
            level: levelKey,
            userResponse: entry.userAnswer,
            fullCorrectAnswer: correctArr,
            timeTaken: entry.timeTaken,
          };
        });

        context.resultData = {
          summary: {
            ActivityName: 'Sem3',
            activityStatus: context.activity_Status,
            totalTimeElapsed: context.timestart,
            questionsAttempted: context.Questions_attempted,
            correctAnswers: context.correct_Answers,
            incorrectAnswers: context.incorrect_Answers,
            testDate: new Date().toISOString(),
          },
          detailedResults,
        };

        context.JsonArrData = JSON.stringify(context.resultData, null, 2);
      }
    }


       export function FinalResulthelper3(context) {
      const now = new Date()
      const testDate = now.toISOString()
      const fullResult = context.resultData || {}

      const blob = new Blob([JSON.stringify(fullResult, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Test_Result_${testDate}.json`
      a.click()
      URL.revokeObjectURL(url)
    }

      export function PracticeNexthelper3(context) {
      context.InstructionShow = false
      context.practice0()
    }

   export function getVisualArrowhelper(option) {
      if (!option) return ''
      const arrowMatch = option.match(/➚/g)
      return arrowMatch ? '➚' : ''
    }

    export function getArrowStylehelper( context ,option) {
      const count = (option.match(/➚/g) || []).length
      const baseSize = context.screenSize === 'sm' ? 1 : context.screenSize === 'md' ? 1.2 : 1.5
      if (count >= 3) return { fontSize: `${2.5 * baseSize}rem`, fontWeight: 700, verticalAlign: 'middle' }
      if (count === 2) return { fontSize: `${1.8 * baseSize}rem`, fontWeight: 600, verticalAlign: 'middle' }
      if (count === 1) return { fontSize: `${1.2 * baseSize}rem`, fontWeight: 500, verticalAlign: 'middle' }
      return {}
    }
    
      export function getVisualRectanglehelper(option) {
      if (!option) return ''
      if (option.includes('█')) return '█'
      if (option.includes('▌')) return '▌'
      if (option.includes('▏')) return '▏'
      return ''
    }

      export function getRectangleStylehelper( context ,option) {
      const baseSize = context.screenSize === 'sm' ? 0.8 : context.screenSize === 'md' ? 1 : 1.2
      if (option.includes('█')) {
        return { fontSize: `${2.2 * baseSize}rem`, marginLeft: '0.2em', verticalAlign: 'middle' }
      }
      if (option.includes('▌')) {
        return { fontSize: `${1.6 * baseSize}rem`, marginLeft: '0.2em', verticalAlign: 'middle' }
      }
      if (option.includes('▏')) {
        return { fontSize: `${1.1 * baseSize}rem`, marginLeft: '0.2em', verticalAlign: 'middle' }
      }
      return {}
    }
      export function TimerFunhelper3( context) {
      setInterval(() => {
        context.timestart++
      }, 1000)
    }
   export function secondsToTimehelper(s) {
      const h = String(Math.floor(s / 3600)).padStart(2, '0')
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
      const sec = String(s % 60).padStart(2, '0')
      return `${h}:${m}:${sec}`
    }
    export function runhelper3(context) {
      context.InstructionShow = context.mode === 'instruction'
      context.resultShow = false
      context.PlayBtnshow = false
      if (!context.InstructionShow) context.practice0()
    }
 export function goToPreviousQuestionhelper3(context) {
      if (context.counter <= 0) return
      context.counter--
      context.countcorrect = 1
      context.viewingPrevious = true
      context.practice0()
      context.highlightPreviousAnswer()
    }

       export function highlightPreviousAnswerhelper( context) {
      const questionId = context.counter + 1
      const previousAnswer = context.practiceList.find((q) => q.id === questionId)

      if (previousAnswer) {
        const userAnswerIndex = parseInt(previousAnswer.userAnswer) - 1
        const isCorrect = previousAnswer.fullCorrectAnswer[userAnswerIndex] === 'Yes'

        context.commonNumArray.forEach((opt, i) => {
          if (i === userAnswerIndex) {
            opt.state = isCorrect ? 'correct' : 'incorrect'
          } else {
            opt.state = 'base'
          }
        })
      }
    }
//debug3 
export function practice0helper3(context) {
  // Add comprehensive safety checks
  if (!context.activityQuestions || typeof context.activityQuestions !== 'object') {
    console.error('activityQuestions is not available')
    return
  }

  if (!context.selectedLevels || !Array.isArray(context.selectedLevels)) {
    console.error('selectedLevels is not available')
    return
  }

  if (context.jsonFileName === 'CSR-I') {
    // CSR-I logic: pool all valid questions across levels
    if (context.items.length === 0) {
      context.TimerFun()
      context.AnswerCheckShow = true
      context.PracticeOne = true

      const allValidQuestions = []
      for (const level of context.selectedLevels) {
        const levelKey = `Level${level}`
        const levelItems = context.activityQuestions[levelKey]
        
        if (!levelItems || !Array.isArray(levelItems)) continue

        const validItems = levelItems.filter(item => {
          if (!item || typeof item !== 'object') return false
          
          try {
            const questionKey = Object.keys(item).find(k => k.startsWith('QuestionArr_'))
            const optionKey = Object.keys(item).find(k => k.startsWith('OptionArr_'))
            const questionValue = questionKey ? item[questionKey] : []
            const optionValue = optionKey ? item[optionKey] : []
            return Array.isArray(questionValue) && questionValue.length > 0
              && Array.isArray(optionValue) && optionValue.length > 0
          } catch (e) {
            return false
          }
        })

        allValidQuestions.push(
          ...validItems.map((item, index) => ({
            ...item,
            __index: index,
            __level: levelKey,
          }))
        )
      }

      const shuffled = allValidQuestions.sort(() => Math.random() - 0.5)
      const questionsToUse = Math.min(context.Total_Questions, shuffled.length)
      context.items = shuffled.slice(0, questionsToUse)
      context.Total_Questions = context.items.length
      context.ProgressBar = Array(context.Total_Questions).fill(null).map((_, i) => ({ index: i, state: null }))
    }
  } else {
    // Other activities: FIX THE INDEXING ISSUE
    if (context.items.length === 0) {
      context.TimerFun()
      context.AnswerCheckShow = true
      context.PracticeOne = true

      const allValidItems = []

      // COLLECT ALL VALID ITEMS FROM ALL LEVELS FIRST
      for (const level of context.selectedLevels) {
        const levelKey = `Level${level}`
        const levelItems = context.activityQuestions[levelKey]
        
        if (!levelItems || !Array.isArray(levelItems)) continue

        const validItems = levelItems.filter(item => {
          return item && typeof item === 'object' && item !== null
        })

        // Add level metadata to each valid item
        allValidItems.push(...validItems.map((item, index) => ({
          ...item,
          __index: index,
          __level: levelKey,
          __originalIndex: levelItems.indexOf(item) // Keep track of original index too
        })))
      }

      // SHUFFLE ALL ITEMS TOGETHER
      const shuffledItems = allValidItems.sort(() => Math.random() - 0.5)
      
      // TAKE ONLY THE NUMBER REQUESTED
      context.items = shuffledItems.slice(0, context.Total_Questions)
      
      // UPDATE TOTAL_QUESTIONS TO MATCH ACTUAL AVAILABLE
      if (context.items.length < context.Total_Questions) {
        context.Total_Questions = context.items.length
        context.ProgressBar = Array(context.Total_Questions).fill(null).map((_, i) => ({ index: i, state: null }))
      }

      console.log(`Loaded ${context.items.length} items for ${context.jsonFileName}`)
    }
  }

  // BOUNDS CHECK
  if (context.counter >= context.items.length) {
    console.warn(`Counter ${context.counter} exceeds items length ${context.items.length}`)
    return
  }

  const questionObj = context.items[context.counter]
  
  // COMPREHENSIVE VALIDATION
  if (!questionObj || typeof questionObj !== 'object' || questionObj === null) {
    console.error('Invalid question object at counter:', context.counter, 'Items length:', context.items.length)
    console.log('Available items:', context.items)
    return
  }

  // SAFE Object.keys() CALLS
  let questionKey, optionKey, answerKey
  try {
    questionKey = Object.keys(questionObj).find(k => k.startsWith('QuestionArr_'))
    optionKey = Object.keys(questionObj).find(k => k.startsWith('OptionArr_'))
    answerKey = Object.keys(questionObj).find(k => k.startsWith('AnswerArr_'))
  } catch (e) {
    console.error('Error accessing question object keys:', e)
    return
  }

  context.questionStartTime = Date.now()

  const QuestionValue = questionKey ? questionObj[questionKey] || [] : []
  const OptionValue = optionKey ? questionObj[optionKey] || [] : []
  let AnswerValue = answerKey ? questionObj[answerKey] || [] : []

  if (!Array.isArray(AnswerValue)) AnswerValue = []

  // Set image properties
  context.ImageNames = questionObj.ImageName || ''
  context.ImageNames1 = questionObj.QuestionImage || 'NA'
  context.ImageNames2 = questionObj.ImageName2 || 'NA'  
  context.ImageNames3 = questionObj.ImageName3 || 'NA'
  context.ImageNames4 = questionObj.ImageName4 || 'NA'

  // Build options array
  context.commonNumArray = OptionValue.map((opt, i) => {
    const existingAnswer = context.practiceList.find(q => q.id === context.counter + 1)
    const isSelected = existingAnswer && existingAnswer.userAnswer === (i + 1).toString()
    const isCorrect = existingAnswer && existingAnswer.fullCorrectAnswer && existingAnswer.fullCorrectAnswer[i] === 'Yes'

    return {
      index: i,
      state: isSelected ? (isCorrect ? 'correct' : 'incorrect') : 'base',
      Answer: AnswerValue[i],
      Option: opt,
      Question: QuestionValue,
    }
  })

  context.PrevQuestionShow = context.counter > 0

  // FORCE REACTIVITY UPDATE
  context.$nextTick(() => {
    console.log(`Updated to question ${context.counter + 1}:`, {
      questionObj: questionObj,
      QuestionValue: QuestionValue,
      OptionValue: OptionValue,
      ImageNames: context.ImageNames,
      commonNumArray: context.commonNumArray.length
    })
  })
}




// debug 2
// export function practice0helper3(context) {
//   // Add comprehensive safety checks
//   if (!context.activityQuestions || typeof context.activityQuestions !== 'object') {
//     console.error('activityQuestions is not available')
//     return
//   }

//   if (!context.selectedLevels || !Array.isArray(context.selectedLevels)) {
//     console.error('selectedLevels is not available')
//     return
//   }

//   if (context.jsonFileName === 'CSR-I') {
//     // CSR-I logic: pool all valid questions across levels
//     if (context.items.length === 0) {
//       context.TimerFun()
//       context.AnswerCheckShow = true
//       context.PracticeOne = true

//       const allValidQuestions = []
//       for (const level of context.selectedLevels) {
//         const levelKey = `Level${level}`
//         const levelItems = context.activityQuestions[levelKey]
        
//         if (!levelItems || !Array.isArray(levelItems)) continue

//         const validItems = levelItems.filter(item => {
//           if (!item || typeof item !== 'object') return false
          
//           try {
//             const questionKey = Object.keys(item).find(k => k.startsWith('QuestionArr_'))
//             const optionKey = Object.keys(item).find(k => k.startsWith('OptionArr_'))
//             const questionValue = questionKey ? item[questionKey] : []
//             const optionValue = optionKey ? item[optionKey] : []
//             return Array.isArray(questionValue) && questionValue.length > 0
//               && Array.isArray(optionValue) && optionValue.length > 0
//           } catch (e) {
//             console.warn('Error validating item:', e)
//             return false
//           }
//         })

//         allValidQuestions.push(
//           ...validItems.map((item, index) => ({
//             ...item,
//             __index: index,
//             __level: levelKey,
//           }))
//         )
//       }

//       const shuffled = allValidQuestions.sort(() => Math.random() - 0.5)
//       const questionsToUse = Math.min(context.Total_Questions, shuffled.length)
//       context.items = shuffled.slice(0, questionsToUse)
//       context.Total_Questions = context.items.length
//       context.ProgressBar = Array(context.Total_Questions).fill(null).map((_, i) => ({ index: i, state: null }))
//     }
//   } else {
//     // Other activities: COMPREHENSIVE VALIDATION
//     if (context.items.length === 0) {
//       context.TimerFun()
//       context.AnswerCheckShow = true
//       context.PracticeOne = true

//       const selectedItems = []
//       const questionsPerLevel = Math.floor(context.Total_Questions / context.selectedLevels.length)
//       let remaining = context.Total_Questions % context.selectedLevels.length

//       for (const level of context.selectedLevels) {
//         const levelKey = `Level${level}`
//         const levelItems = context.activityQuestions[levelKey]
        
//         if (!levelItems || !Array.isArray(levelItems)) continue

//         // FILTER OUT COMPLETELY INVALID ITEMS
//         const validItems = levelItems.filter(item => {
//           return item && typeof item === 'object' && item !== null
//         })

//         let count = questionsPerLevel + (remaining > 0 ? 1 : 0)
//         if (remaining > 0) remaining--
        
//         const shuffled = validItems.slice().sort(() => Math.random() - 0.5)
//         const subset = shuffled.slice(0, count).map((item, index) => ({
//           ...item,
//           __index: index,
//           __level: levelKey,
//         }))
//         selectedItems.push(...subset)
//       }

//       context.items = selectedItems
//       console.log(`Loaded ${context.items.length} items for ${context.jsonFileName}`)
//     }
//   }

//   // BOUNDS CHECK
//   if (context.counter >= context.items.length) {
//     console.warn(`Counter ${context.counter} exceeds items length ${context.items.length}`)
//     return
//   }

//   const questionObj = context.items[context.counter]
  
//   // COMPREHENSIVE VALIDATION
//   if (!questionObj || typeof questionObj !== 'object' || questionObj === null) {
//     console.error('Invalid question object at counter:', context.counter)
//     return
//   }

//   // SAFE Object.keys() CALLS
//   let questionKey, optionKey, answerKey
//   try {
//     questionKey = Object.keys(questionObj).find(k => k.startsWith('QuestionArr_'))
//     optionKey = Object.keys(questionObj).find(k => k.startsWith('OptionArr_'))
//     answerKey = Object.keys(questionObj).find(k => k.startsWith('AnswerArr_'))
//   } catch (e) {
//     console.error('Error accessing question object keys:', e)
//     return
//   }

//   context.questionStartTime = Date.now()

//   const QuestionValue = questionKey ? questionObj[questionKey] || [] : []
//   const OptionValue = optionKey ? questionObj[optionKey] || [] : []
//   let AnswerValue = answerKey ? questionObj[answerKey] || [] : []

//   if (!Array.isArray(AnswerValue)) AnswerValue = []

//   // Set defaults for missing data
//   context.ImageNames = questionObj.ImageName || ''
//   context.ImageNames1 = questionObj.QuestionImage || 'NA'
//   context.ImageNames2 = questionObj.ImageName2 || 'NA'
//   context.ImageNames3 = questionObj.ImageName3 || 'NA'
//   context.ImageNames4 = questionObj.ImageName4 || 'NA'

//   context.commonNumArray = OptionValue.map((opt, i) => {
//     const existingAnswer = context.practiceList.find(q => q.id === context.counter + 1)
//     const isSelected = existingAnswer && existingAnswer.userAnswer === (i + 1).toString()
//     const isCorrect = existingAnswer && existingAnswer.fullCorrectAnswer[i] === 'Yes'

//     return {
//       index: i,
//       state: isSelected ? (isCorrect ? 'correct' : 'incorrect') : 'base',
//       Answer: AnswerValue[i],
//       Option: opt,
//       Question: QuestionValue,
//     }
//   })

//   context.PrevQuestionShow = context.counter > 0
// }

//

// original

    //   export function practice0helper3(context) {
    //   if (context.items.length === 0) {
    //     context.TimerFun()
    //     context.AnswerCheckShow = true
    //     context.PracticeOne = true

    //     const selectedItems = []
    //     const levels = context.selectedLevels
    //     const questionsPerLevel = Math.floor(context.Total_Questions / levels.length)
    //     let remaining = context.Total_Questions % levels.length

    //     for (const level of levels) {
    //       const levelKey = `Level${level}`
    //       const levelItems = context.activityQuestions[levelKey] || []
    //       let count = questionsPerLevel + (remaining > 0 ? 1 : 0)
    //       if (remaining > 0) remaining--
    //       const shuffled = levelItems.slice().sort(() => Math.random() - 0.5)
    //       const subset = shuffled.slice(0, count).map((item) => ({
    //         ...item,
    //         __index: levelItems.indexOf(item),
    //         __level: levelKey,
    //       }))
    //       selectedItems.push(...subset)
    //     }

    //     context.items = selectedItems
    //   }

    //   if (context.counter >= context.items.length) return

    //   const questionObj = context.items[context.counter]
    //   const questionKey = Object.keys(questionObj).find((k) =>
    //     k.startsWith('QuestionArr_')
    //   )
    //   const optionKey = Object.keys(questionObj).find((k) =>
    //     k.startsWith('OptionArr_')
    //   )
    //   const answerKey = Object.keys(questionObj).find((k) =>
    //     k.startsWith('AnswerArr_')
    //   )

    //   context.questionStartTime = Date.now()

    //   const QuestionValue = questionObj[questionKey] || []
    //   const OptionValue = questionObj[optionKey] || []
    //   let AnswerValue = questionObj[answerKey] || []

    //   if (!Array.isArray(AnswerValue)) AnswerValue = []

    //   if (!QuestionValue.length || !OptionValue.length) {
    //     console.warn('Invalid question skipped:', questionObj)
    //     context.counter++
    //     context.practice0()
    //     return
    //   }

    //   context.ImageNames = questionObj.ImageName || ''
    //   context.ImageNames1 = questionObj.QuestionImage || 'NA'
    //   context.ImageNames2 = questionObj.ImageName2 || 'NA'
    //   context.ImageNames3 = questionObj.ImageName3 || 'NA'
    //   context.ImageNames4 = questionObj.ImageName4 || 'NA'

    //   context.commonNumArray = OptionValue.map((opt, i) => {
    //     const existingAnswer = context.practiceList.find(
    //       (q) => q.id === context.counter + 1
    //     )
    //     const isSelected =
    //       existingAnswer && existingAnswer.userAnswer === (i + 1).toString()
    //     const isCorrect =
    //       existingAnswer && existingAnswer.fullCorrectAnswer[i] === 'Yes'

    //     return {
    //       index: i,
    //       state: isSelected ? (isCorrect ? 'correct' : 'incorrect') : 'base',
    //       Answer: AnswerValue[i],
    //       Option: opt,
    //       Question: QuestionValue,
    //     }
    //   })

    //   context.PrevQuestionShow = context.counter > 0
    // }




