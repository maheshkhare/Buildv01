<template>
<div class="flex-container">
    <!-- ✅✅✅ Rectangle Matching Mode -->
    <div v-if="isRectangleMode" class="w-full flex flex-col items-center">
        <ExerciseToggleView :show="showExerciseView" :fileName="file_Name" :paragraphText="paragraphText" :getImgUrlByFileName="getImgUrlByFileName" @toggle="toggleExerciseView" />

        <RectangleSelection v-if="!showExerciseView" :instruction="instructionText" :rectangles="rectangles" :options="options" :selectedIndex="selectedRectangleIndex" :getImgUrlByFileName="getImgUrlByFileName" @selectRectangle="selectRectangle" @assignOption="assignOptionToRectangle" />

        <NavigationBar :current="counter" :total="Total_Questions" @prev="emitPreviousQuestion" @next="emitAnswerCheck" />

        <SaveExitButton @save-and-exit="handleSaveAndExit" />
    </div>

    <!-- ✅✅✅ Letter Fill Mode -->
    <div v-else-if="isLetterFillMode" class="w-full">

        <div class="flex flex-col lg:flex-row w-full lg:flex-nowrap">
            <!-- LEFT SIDE: BLANKS + IMAGE + PARAGRAPH + NAV -->
            <div class="w-full lg:w-3/4 p-4 border border-gray-300 lg:mr-4 flex flex-col">

                <!-- BLANKS + IMAGE Row -->
                <div class="flex flex-col md:flex-row gap-8 mb-6 items-start md:items-center">

                    <!-- Blanks -->
                    <BlanksFill :blanks="blanks" :numBlanks="numBlanks" :getBlankKey="getBlankKey" @selectBlank="selectLetterBlank" />
                    
                    <!-- Responsive Image -->
                    <QuestionImage :image="Image" :getImgUrl="getImgUrl" />

                </div>

                <!-- PARAGRAPH -->
                <div class="w-full p-2 border border-gray-300 rounded-lg bg-white leading-relaxed text-lg text-gray-800" style="white-space: pre-wrap; word-wrap: break-word;" v-html="cleanedParagraph"></div>

                <!-- NAVIGATION -->
                <NavigationBar :current="counter" :total="Total_Questions" @prev="emitPreviousQuestion" @next="emitAnswerCheck" />

                <!-- SAVE & EXIT -->
                <SaveExitButton @save-and-exit="handleSaveAndExit" />
            </div>

            <!-- RIGHT SIDE SYMBOLS -->
            <SymbolOptions :symbols="symbols" @assign="assignLetter" />

        </div>
    </div>

    <!-- ✅✅✅ Normal Paragraph Mode -->
    <div v-else class="w-full">
        <h5 class="mb-4 text-lg font-bold bg-gray-100 p-4 rounded text-gray-800">{{ instructionText }}</h5>

        <!-- ✅ Flex row for left & right sides -->
        <div class="flex flex-col lg:flex-row w-full lg:flex-nowrap">
            <!-- LEFT SIDE -->
            <div class="w-full lg:w-3/4 p-4 border border-gray-300 lg:mr-4 flex flex-col">
                <!-- ICON BLANKS -->
                <!-- Non-CST-II -->
                <ParagraphWithDroppableBlanks v-if="file_Name != 'CST-II'" :parsedParagraph="parsedParagraph" :getBlankValue="getBlankValue" @drop="handleDropInParagraph" />

                <!-- CST-II -->
                <IconBlanks v-if="file_Name == 'CST-II'" :iconBlanks="iconBlanks" :selectedIconBox="selectedIconBox" :getImgUrlByFileName="getImgUrlByFileName" @select="selectIconBox" @dropSymbol="handleDropSymbol" />
                <CSTParagraphImage v-if="file_Name === 'CST-II'" :paragraphText="paragraphText" :getImgUrlByFileName="getImgUrlByFileName" />

                <!-- NAV + Save and Exit -->
                <div class="flex flex-col mt-6">
                    <!-- Navigation Row -->
                    <NavigationBar :current="counter" :total="Total_Questions" @prev="emitPreviousQuestion" @next="emitAnswerCheck" />
                    <!-- Save and Exit -->
                    <SaveExitButton @save-and-exit="handleSaveAndExit" />
                </div>

            </div>

            <!-- RIGHT SIDE SYMBOLS -->
            <DragSymbols :symbols="symbols" />

        </div>
    </div>

</div>
</template>
<script>
import 'CSS/tailwind.css'
import ExerciseToggleView from '../../../common-generic-templates/ExerciseToggleView.vue';
import RectangleSelection from '../../../common-generic-templates/RectangleSelection.vue';
import NavigationBar from '../../../common-generic-templates/NavigationBar.vue';
import SaveExitButton from '../../../common-generic-templates/SaveExitButton.vue';
import BlanksFill from '../../../common-generic-templates/BlanksFill.vue'
import QuestionImage from '../../../common-generic-templates/QuestionImage.vue'
import SymbolOptions from '../../../common-generic-templates/SymbolOptions.vue'
import ParagraphWithDroppableBlanks from '../../../common-generic-templates/ParagraphWithDroppableBlanks.vue'
import IconBlanks from '../../../common-generic-templates/IconBlanks.vue'
import CSTParagraphImage from '../../../common-generic-templates/CSTParagraphImage.vue'
import DragSymbols from '../../../common-generic-templates/DragSymbols.vue'
import {
    handleDropInParagraphHelper,
    assignOptionToRectangleHelper,
    getImgUrlHelper,
    getImgUrlByFileNameHelper,
    getBlankKeyHelper,
    assignLetterHelper
} from '../../../common-generic-components/activityHelpers.js';

export default {
    name: 'SectionSem4Top',
    components: {
        ExerciseToggleView,
        RectangleSelection,
        NavigationBar,
        SaveExitButton,
        BlanksFill,
        QuestionImage,
        SymbolOptions,
        ParagraphWithDroppableBlanks,
        IconBlanks,
        CSTParagraphImage,
        DragSymbols
    },
    props: {
        counter: Number,
        viewingPrevious: Boolean,
        acceptInput: Boolean,
        commonNumArray: Array,
        PrevQuestionShow: Boolean,
        AnswerCheckShow: Boolean,
        NextQuestionShow: Boolean,
        ProgressBar: Array,
        Total_Questions: String,
        symbols: Array,
        iconBlanks: Array,
        paragraphText: String,
        instructionText: String,
        symbols: Array,
        iconBlanks: Array,
        rectangles: {
            type: Array,
            default: () => []
        },
        options: {
            type: Array,
            default: () => []
        },
        isRectangleMode: Boolean,
        Image: String, // the image filename or URL
        symbol: Array, // your letter options: S, A, D, E, I
        blanks: Array, // your blanks with partial letters
        isLetterFillMode: Boolean,
        symbolColorMap: {
            type: Object,
            default: () => ({}),
        },
    },

    computed: {
        cleanedParagraph() {
            if (!this.commonNumArray.length) return this.paragraphText || ''
            return this.commonNumArray[0]?.Question ?.split('\n').map(line => line.trim()).join('\n') || ''
        },
        parsedParagraph() {
            const txt = (this.paragraphText || this.cleanedParagraph || '') + '';
            const parts = [];
            const regex = /\{\{(blank\d+)\}\}/gi; // matches {{blank1}}, {{blank2}}, ...
            let lastIndex = 0;
            let m;
            while ((m = regex.exec(txt)) !== null) {
                if (m.index > lastIndex) {
                    parts.push({
                        type: 'text',
                        text: txt.slice(lastIndex, m.index)
                    });
                }
                parts.push({
                    type: 'blank',
                    id: m[1]
                }); // e.g. {type:'blank', id:'blank1'}
                lastIndex = regex.lastIndex;
            }
            if (lastIndex < txt.length) parts.push({
                type: 'text',
                text: txt.slice(lastIndex)
            });
            return parts;
        },

    },

    watch: {
        iconBlanks: {
            handler(newVal) {
                this.localBlanks = JSON.parse(JSON.stringify(newVal || []));
            },
            deep: true,
            immediate: true
        }
    },

    data() {
        return {
            selectedBlank: null,
            selectedIconBox: null,
            selectedRectangleIndex: null,
            selectedBlankId: null,
            selectedBlankIndex: null,
            selectedIconBoxIndex: 0,
            file_Name: sessionStorage.getItem('jsonFile') || 'CST-II',
            showExerciseView: false,
            draggedSymbol: null, // store dragged symbol here
            localBlanks: JSON.parse(JSON.stringify(this.iconBlanks || [])),
        }
    },

    methods: {
        handleDropInParagraph(blankId, event) {
            handleDropInParagraphHelper(this, blankId, event);
        },

        formattedParagraph() {
            if (!this.paragraphText) return '';
            return this.paragraphText.replace(/blank\d+/g, '_______');
        },

        handleDragStart(symbol, event) {
            event.dataTransfer.setData('application/json', JSON.stringify(symbol));
            event.dataTransfer.setData('text/plain', symbol.symbol || symbol.value || '');
        },

        handleDropSymbol({ index, symbol }) {
            this.$set(this.iconBlanks[index], 'value', symbol.symbol || symbol);
        },

        handleDrop(index) {
            if (this.draggedSymbol) {
                this.$set(this.iconBlanks[index], 'value', this.draggedSymbol.symbol);
                this.draggedSymbol = null; // clear after drop
            }
        },
        handleSaveAndExit() {
            console.log("Save and exit clicked");
            this.$emit('save-and-exit');
        },

        selectRectangle(idx) {
            this.selectedRectangleIndex = idx;
        },

        assignOptionToRectangle(opt) {
            assignOptionToRectangleHelper(this, opt);
        },

        selectIconBox(box, index) {
            this.selectedIconBox = box.id;
            this.selectedIconBoxIndex = index;
        },

        NextQuestion() {
            this.$emit('NextQuestion')
        },

        emitPreviousQuestion() {
            this.$emit('PreviousQuestion')
        },

        emitAnswerCheck() {
            this.$emit('AnswerCheck')
        },

        getImgUrl(ImgName) {
            return getImgUrlHelper(this, ImgName);
        },

        getImgUrlByFileName(ImgName) {
            return getImgUrlByFileNameHelper(this, ImgName);
        },

        toggleExerciseView() {
            this.showExerciseView = !this.showExerciseView;
        },

        numBlanks(blank) {
            return Object.keys(blank).filter(k => k.includes('BlankValue')).length;
        },

        getBlankKey(n) {
            return getBlankKeyHelper(this, n);
        },

        getBlankValue(id) {
            const b = (this.localBlanks || []).find(x => x.id === id);
            return b ? b.value : '';
        },

        selectLetterBlank(blankId, index) {
            this.selectedBlankId = blankId;
            this.selectedBlankIndex = index;
        },

        assignLetter(letter) {
            assignLetterHelper(this, letter);
        },
    }
}
</script>

<style>
.flex-container {
    display: flex;
    justify-content: center;
    margin: auto;
}
</style>