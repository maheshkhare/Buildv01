<template>
  <div class="flex-container">
    <!-- ✅✅✅ Rectangle Matching Mode -->
    <div v-if="isRectangleMode" class="w-full flex flex-col items-center">
      <h5 class="mb-4 text-lg font-bold bg-gray-100 p-4 rounded text-gray-800">{{ instructionText }}</h5>

      <!-- Rectangles -->
      <div class="flex flex-wrap gap-4 mb-8">
        <div
          v-for="(rect, idx) in rectangles"
          :key="idx"
          @click="selectRectangle(idx)"
          class="border-2 border-dashed p-4 w-20 h-20 flex flex-col justify-center items-center rounded cursor-pointer"
          :class="{ 'ring-2 ring-blue-400': selectedRectangleIndex === idx }"
        >
          <!-- <span class="text-2xl mb-2">{{ rect.symbol }}</span> -->
           <span class="text-2xl mb-2" v-html="getColoredSymbol(rect.symbol)"></span>

         <span class="text-xl font-bold">
          {{ rect.chosenOption && rect.chosenOption.letter || '____' }}
        </span>

        </div>
      </div>

      <!-- Options -->
      <div class="grid grid-cols-5 gap-4">
        <button
          v-for="(opt, idx) in options"
          :key="idx"
          @click="assignOptionToRectangle(opt)"
          class="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
        >
          {{ opt.letter }}
        </button>
      </div>

      <!-- Nav -->
      <div class="flex justify-between w-full mt-6">
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded"
          @click="emitPreviousQuestion"
        >
          Previous
        </button>
          <p class="font-semibold text-center mx-4">
        Question - {{ counter + 1 }} of {{ Total_Questions }}
      </p>
        <button
          class="px-4 py-2 bg-green-500 text-white rounded"
          @click="emitAnswerCheck"
        >
          Next
        </button>
      </div>
    </div>

        <!-- ✅✅✅ Letter Fill Mode -->
<div v-else-if="isLetterFillMode" class="w-full">
  <div class="flex flex-row w-full flex-wrap">

    <!-- LEFT SIDE: BLANKS + IMAGE + PARAGRAPH + NAV -->
    <div class="w-full lg:w-3/4 p-4 border border-gray-300 lg:mr-4 flex flex-col">

      <!-- BLANKS + IMAGE Row -->
      <div class="flex flex-col md:flex-row gap-8 mb-6 items-start md:items-center">

        <!-- Blanks -->
        <div class="flex flex-col gap-2">
          <div
            v-for="blank in blanks"
            :key="blank.id"
            class="flex items-center gap-4 text-lg"
          >
            <span v-if="blank.firstSymbol">{{ blank.firstSymbol }}</span>

            <button
              v-for="n in numBlanks(blank)"
              :key="`blank-${blank.id}-index-${n}`"
              class="border-b-2 border-black w-6 h-8 text-center text-lg focus:outline-none"
              @click="selectLetterBlank(blank.id, n)"
            >
              {{ getBlankValue(blank, n) || '_' }}
            </button>

            <span v-if="blank.lastSymbol">{{ blank.lastSymbol }}</span>
          </div>
        </div>

        <!-- Responsive Image -->
        <div class="flex-shrink-0 w-full md:w-[585px] relative">
          <div class="relative w-full" style="aspect-ratio: 585/455;">
            <img
              :src="getImgUrl(Image)"
              alt="Question Visual"
              class="w-full h-full object-contain rounded shadow-md border border-gray-300"
            />
            <!-- Optional: If you overlay symbols on image later, they go here -->
          </div>
        </div>
      </div>

      <!-- PARAGRAPH -->
      <div
        class="w-full p-2 border border-gray-300 rounded-lg bg-white leading-relaxed text-lg text-gray-800"
        style="white-space: pre-wrap; word-wrap: break-word;"
        v-html="cleanedParagraph"
      ></div>

      <!-- NAVIGATION -->
      <div class="flex justify-between mt-6">
        <!-- Previous -->
<button
  class="px-4 py-2 bg-blue-500 text-white rounded"
  @click="emitPreviousQuestion"
  :style="{
    position: 'relative',
    zIndex: 999,
    pointerEvents: 'auto'
  }"
>
  Previous
</button>

<!-- Next -->
<button
  class="px-4 py-2 bg-green-500 text-white rounded"
  @click="emitAnswerCheck"
  :style="{
    position: 'relative',
    zIndex: 999,
    pointerEvents: 'auto'
  }"
>
  Next
</button>

      </div>
    </div>

    <!-- RIGHT SIDE SYMBOLS -->
    <div class="w-full lg:w-1/4 p-4 grid grid-cols-3 gap-2 border border-gray-300" >
      <button
  v-for="symbol in symbols"
  :key="symbol.id"
  @click="assignLetter(symbol.symbol)"
  class="border p-2 rounded text-lg hover:bg-gray-200"
  :style="{
    position: 'relative',
    zIndex: 999,
    pointerEvents: 'auto'
  }"
>
  {{ symbol.symbol }}
</button>

    </div>
  </div>
</div>




    <!-- ✅✅✅ Normal Paragraph Mode -->
    <div v-else class="w-full">
       <h5 class="mb-4 text-lg font-bold bg-gray-100 p-4 rounded text-gray-800">{{ instructionText }}</h5>

       <!-- ✅ Flex row for left & right sides -->
  <div class="quiz-container">
  <div class="flex flex-row w-full">
      <!-- LEFT SIDE -->
      <div class="w-3/4 p-4 border border-gray-300 mr-4 flex flex-col">
        <!-- ICON BLANKS -->
<div v-if="file_Name != 'CST-II'" class="flex flex-wrap gap-4 mb-6">
  <div
    v-for="(box, index) in iconBlanks"
    :key="box.id"
    @click="selectIconBox(box, index)"
    class="flex items-center border-2 border-dashed border-gray-400 px-4 py-2 rounded cursor-pointer"
    :class="{ 'ring-2 ring-blue-400': selectedIconBox === box.id }"
    :ref="`blankBox_${index}`"
  >
    <!-- 🔥 Use same color map! -->
    <span
      class="text-2xl mr-4"
      :style="{ color: symbolColorMap[box.symbol] || '#000', fontWeight: 'bold' }"
    >
      {{ box.symbol }}
    </span>

    <span class="border-b-2 border-black px-4">
      {{ box.value || '____' }}
    </span>
  </div>
</div>

<div v-if="file_Name == 'CST-II'" class="flex flex-wrap gap-4 mb-6">
  <div
    v-for="(box, index) in iconBlanks"
    :key="box.id"
    @click="selectIconBox(box, index)"
    class="flex items-center border-2 border-dashed border-gray-400 px-4 py-2 rounded cursor-pointer"
    :class="{ 'ring-2 ring-blue-400': selectedIconBox === box.id }"
    :ref="`blankBox_${index}`"
  >
    <!-- ✅ Only show image -->
    <img
      :src="getImgUrlByFileName(box.symbol)"
      alt="icon"
      class="w-8 h-8 mr-4 object-contain"
    />

    <span class="border-b-2 border-black px-4">
      {{ box.value || '____' }}
    </span>
  </div>
</div>

<div
  class="w-full p-6 border border-gray-300 rounded-lg bg-white leading-relaxed text-lg text-gray-800"
  style="white-space: pre-wrap; word-wrap: break-word; line-height: 1.8; letter-spacing: 0.02em;"
>
 <img :src="getImgUrlByFileName(this.paragraphText)" style="width: 100%; height: 100%; object-fit: cover;" />
</div>



        <!-- NAV -->
        <div class="flex justify-between mt-6">
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="emitPreviousQuestion"
          >
            Previous
          </button>
          <p class="font-semibold text-center mx-4">
            Question - {{ counter + 1 }} of {{ Total_Questions }}
          </p>
          <button
            class="px-4 py-2 bg-green-500 text-white rounded"
            @click="emitAnswerCheck"
          >
            Next
          </button>
        </div>
      </div>

      <!-- RIGHT SIDE SYMBOLS -->
      <div class="w-1/4 p-4 grid grid-cols-3 gap-2 border border-gray-300">
        <button
          v-for="symbol in symbols"
          :key="symbol.id"
          @click="assignSymbol(symbol)"
          class="border p-2 rounded text-lg hover:bg-gray-200"
        >
          {{ symbol.symbol }}
        </button>
      </div>
    </div>

  </div>
  </div>


  </div>
</template>

<style scoped>
:deep(button),
:deep(.option-box),
:deep(.blank-option),
:deep(.nav-button) {
  position: relative;
  z-index: 10;
  pointer-events: auto;
}

:deep(.quiz-container),
:deep(.main-layout),
:deep(.section-wrapper) {
  overflow: visible !important;
  transform: none !important;
  position: relative;
}
</style>


<script>
import 'CSS/tailwind.css'



export default {
  name: 'SectionSem4Top',
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
     Image: String,  // the image filename or URL
    symbol: Array, // your letter options: S, A, D, E, I
    blanks: Array,   // your blanks with partial letters
    isLetterFillMode: Boolean,
     symbolColorMap: {
    type: Object,
    default: () => ({}),
  },
  },

  computed: {
    cleanedParagraph() {
      if (!this.commonNumArray.length) return this.paragraphText || ''
      return this.commonNumArray[0]?.Question?.split('\n').map(line => line.trim()).join('\n') || ''
    },

  },

  data() {
    return {
      selectedBlank: null,
      selectedIconBox: null,
      selectedRectangleIndex: null,
      selectedBlankId: null,
    selectedBlankIndex: null,
    selectedIconBoxIndex: 0,
    file_Name: sessionStorage.getItem('jsonFile') || 'CST-II'
    }
  },

  methods: {
 formatWithColors(text) {
    const colorMap = this.symbolColorMap || {};
    Object.keys(colorMap).forEach(sym => {
      const escaped = sym.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(escaped, 'g');
      text = text.replace(
        regex,
        `<span style="color: ${colorMap[sym]}; font-weight: bold;">${sym}</span>`
      );
    });
    return text;
  },

  getColoredSymbol(symbol) {
  const color = this.symbolColorMap?.[symbol];
  if (color) {
    return `<span style="color: ${color}; font-weight: bold;">${symbol}</span>`;
  }
  return symbol;
},


    selectRectangle(idx) {
      this.selectedRectangleIndex = idx;
    },
    
 assignOptionToRectangle(opt) {
  if (this.selectedRectangleIndex === null) {
    alert('Please select a rectangle first.');
    return;
  }

  const currentRect = this.rectangles[this.selectedRectangleIndex];

  // ✅ DO NOT overwrite if already filled
  if (currentRect.chosenOption) {
    alert('This rectangle already has a letter.');
    return;
  }

  // ✅ Assign the option
  this.$set(this.rectangles, this.selectedRectangleIndex, {
    ...currentRect,
    chosenOption: opt
  });

  // ✅ Find next empty rectangle
  const nextIdx = this.rectangles.findIndex(
    (r, i) => !r.chosenOption && i > this.selectedRectangleIndex
  );

  if (nextIdx !== -1) {
    this.selectedRectangleIndex = nextIdx;
  } else {
    this.selectedRectangleIndex = null; // all filled
  }
},




    selectIconBox(box, index) {
  this.selectedIconBox = box.id;
  this.selectedIconBoxIndex = index;
},

    // 🟢 When user clicks a symbol
  assignSymbol(symbol) {
    const currentIndex = this.selectedIconBoxIndex;

    if (this.selectedIconBox == null) {
      this.$toast?.warning('Please select a blank first.');
      return;
    }

    const blank = this.iconBlanks.find(b => b.id === this.selectedIconBox);
    if (!blank) return;

    this.$set(blank, 'value', symbol.symbol);

    // ✅ Auto move to next blank, if any
    const nextIndex = currentIndex + 1;
    if (nextIndex < this.iconBlanks.length) {
      this.selectedIconBox = this.iconBlanks[nextIndex].id;
      this.selectedIconBoxIndex = nextIndex;

      // Optional: visually scroll to next
      this.$nextTick(() => {
        const nextEl = this.$refs[`blankBox_${nextIndex}`];
        if (nextEl && nextEl[0]) {
          nextEl[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    } else {
      // All done: maybe deselect?
      this.selectedIconBox = null;
    }
  },
    NextQuestion() {
      this.$emit('NextQuestion')
    },
    emitPreviousQuestion() {
      this.$emit('PreviousQuestion')
    },
    emitAnswerCheck() {
      
  console.log("Call came here in child ......");
      this.$emit('AnswerCheck')
    },
   getImgUrl(ImgName) {
            if (!ImgName) return "";
            var images = require.context('../assets/graphics/', false, /\.png$/);
            return images('./' + ImgName + ".png");
        },

            getImgUrlByFileName(ImgName) {
  console.log("DEBUG ImgName:", ImgName);
  const fileName = sessionStorage.getItem('jsonFile');
  console.log("DEBUG fileName:", fileName);
  const images = require.context('../assets/graphics/', true, /\.png$/);
  const path = `./${fileName}/${ImgName}.png`;
  console.log("Trying to load:", path);
  return images(path);
},
    
  numBlanks(blank) {
  return Object.keys(blank).filter(k => k.includes('BlankValue')).length;
},

getBlankKey(n) {
  if (n === 1) return '1stBlankValue';
  if (n === 2) return '2ndBlankValue';
  if (n === 3) return '3rdBlankValue';
  if (n === 4) return '4thBlankValue';
  if (n === 2) return '5thBlankValue';
  if (n === 3) return '6thBlankValue';
  if (n === 4) return '7thBlankValue';
  return `${n}thBlankValue`;
},

getBlankValue(blank, n) {
  const key = this.getBlankKey(n);
  return blank[key] || '';
},

selectLetterBlank(blankId, index) {
  this.selectedBlankId = blankId;
  this.selectedBlankIndex = index;
},

assignLetter(letter) {
  if (!this.selectedBlankId) {
    alert('Please select a blank first.');
    return;
  }
  const blankIdx = this.blanks.findIndex(b => b.id === this.selectedBlankId);
  const key = this.getBlankKey(this.selectedBlankIndex);
  this.$set(this.blanks[blankIdx], key, letter);
  this.selectedBlankId = null;
  this.selectedBlankIndex = null;
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

.blank-highlight {
  background-color: #ffe4b5;  /* light warm */
  border-bottom: 2px dashed #f59e0b;  /* subtle orange underline */
  padding: 0 4px;
  border-radius: 2px;
}

</style>
