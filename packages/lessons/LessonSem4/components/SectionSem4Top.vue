<template>
  <div class="flex-container">
    <!-- ✅✅✅ Rectangle Matching Mode -->
    <div v-if="isRectangleMode" class="w-full flex flex-col items-center">
      <!-- ✅ Toggle Button -->
      <button
        class="self-start mb-4 ml-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
        @click="toggleExerciseView"
      >
        {{ showExerciseView ? 'Hide Exercise' : 'Show Exercise' }}
      </button>

      <!-- ✅ Exercise Image View -->
      <div v-if="showExerciseView" class="w-full flex justify-center mt-4">
        <!-- If paragraphText is 'CST-II', show image -->
         <div v-if="file_Name === 'CST-II'" class="w-full flex justify-center">
            <img
              :src="getImgUrlByFileName(paragraphText)"
              class="rounded shadow"
              style="max-width: 700px; width: 100%; height: auto; object-fit: contain;"
            />
          </div>

          <div v-else>
            {{ paragraphText }}
          </div>
      </div>

      <!-- Rectangles -->
       <div v-else class="w-full flex flex-col items-center">
        <h5 class="mb-4 text-lg font-bold bg-gray-100 p-4 rounded text-gray-800">
          {{ instructionText }}
        </h5>
      <div class="flex flex-wrap gap-4 mb-8">
        <div
          v-for="(rect, idx) in rectangles"
          :key="idx"
          @click="selectRectangle(idx)"
          class="border-2 border-dashed p-4 w-20 h-21 flex flex-col justify-center items-center rounded cursor-pointer"
          :class="{ 'ring-2 ring-blue-400': selectedRectangleIndex === idx }"
        >
           <!-- Check if it's a valid image first -->
        <div v-if="getImgUrlByFileName(rect.symbol)">
          <img :src="getImgUrlByFileName(rect.symbol)" class="mb-2" />
        </div>
        <div v-else>
          <span class="mt-4 text-2xl mb-2">{{ rect.symbol }}</span>
        </div>
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

     <div class="flex justify-center mt-2">
  <button 
    @click="handleSaveAndExit"
    class="text-blue-700 font-semibold cursor-pointer px-3 py-1 rounded hover:bg-blue-100 inline-block"
    style="font-size: 18px; margin-left: 22px;"
  >
    💾 Save and Exit
  </button>
</div>
       </div>
    </div>

        <!-- ✅✅✅ Letter Fill Mode -->
    <div v-else-if="isLetterFillMode" class="w-full">
      <div class="flex flex-col lg:flex-row w-full lg:flex-nowrap">
        <!-- LEFT SIDE: BLANKS + IMAGE + PARAGRAPH + NAV -->
        <div class="w-full lg:w-3/4 p-4 border border-gray-300 lg:mr-4 flex flex-col">

          <!-- BLANKS + IMAGE Row -->
          <div class="flex flex-col md:flex-row gap-8 mb-6 items-start md:items-center">

            <!-- Blanks -->
    <div class="flex flex-col gap-2 bg-gray-100 p-4 rounded-md shadow-md w-fit">
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
          <div class="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto relative">
      <div class="relative" style="aspect-ratio: 725 / 515;; min-height: 180px;">
        <img
          :src="getImgUrl(Image)"
          alt="Question Visual"
          class="object-contain rounded shadow-md border border-gray-300 w-full h-full"
        />
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
    class="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded text-sm sm:text-base"
    @click="emitPreviousQuestion"
    :style="{
      position: 'relative',
      zIndex: 999,
      pointerEvents: 'auto'
    }"
  >
    Previous
  </button>

  <p class="font-semibold text-center mx-4">
    Question - {{ counter + 1 }} of {{ Total_Questions }}
  </p>

  <!-- Next -->
  <button
    class="px-3 py-1 sm:px-4 sm:py-2 bg-green-500 text-white rounded text-sm sm:text-base"
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


<div class="flex justify-center mt-2">
  <button 
    @click="handleSaveAndExit"
    class="text-blue-700 font-semibold cursor-pointer px-3 py-1 rounded hover:bg-blue-100 inline-block"
    style="font-size: 18px; margin-left: 22px;;"
  >
    💾 Save and Exit
  </button>
</div>
        </div>

        <!-- RIGHT SIDE SYMBOLS -->
        <div class="lg:w-1/4 p-4 grid grid-cols-3 gap-2 border border-gray-300" >
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
 <div class="flex flex-col lg:flex-row w-full lg:flex-nowrap">
      <!-- LEFT SIDE -->
      <div class="w-full lg:w-3/4 p-4 border border-gray-300 lg:mr-4 flex flex-col">
        <!-- ICON BLANKS -->
<!-- Paragraph with inline droppable blanks (replace the old top iconBlanks block) -->
<div v-if="file_Name != 'CST-II'" class="mb-6">
  <div
    class="p-6 border border-gray-300 rounded-lg bg-white text-lg text-gray-800"
    style="white-space: normal; line-height: 1.8; letter-spacing: 0.02em;"
  >
    <template v-for="(part, idx) in parsedParagraph">
      <span
        v-if="part.type === 'text'"
        :key="'text-' + idx"
      >
        {{ part.text.replace(/\n/g, ' ') }}
      </span>

      <span
        v-else
        :key="'blank-' + idx"
        class="inline-block border-b-2 border-black px-4 mx-1 min-w-[40px] text-center align-baseline"
        @dragover.prevent
        @drop="handleDropInParagraph(part.id, $event)"
      >
        {{ getBlankValue(part.id) || '____' }}
      </span>
    </template>
  </div>
</div>




<div v-if="file_Name == 'CST-II'" class="flex flex-wrap gap-4 mb-6">
  <div
    v-for="(box, index) in iconBlanks"
    :key="box.id"
    @click="!box.value && selectIconBox(box, index)"
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
  v-if="file_Name === 'CST-II'"
  class="w-full p-6 border border-gray-300 rounded-lg bg-white leading-relaxed text-lg text-gray-800"
  style="white-space: pre-wrap; word-wrap: break-word; line-height: 1.8; letter-spacing: 0.02em;"
>
<!-- If paragraphText is 'CST-II', show image -->
<img
  :src="getImgUrlByFileName(paragraphText)"
  style="width: 100%; height: 100%; object-fit: cover;"
/>

<!-- Else, show paragraphText as plain text -->
<!-- <div v-else>
  {{ formattedParagraph() }}
</div> -->

</div>



<!-- NAV + Save and Exit -->
<div class="flex flex-col mt-6">
  <!-- Navigation Row -->
  <div class="flex justify-between items-center w-full">
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

 <!-- Save and Exit -->
<div class="flex justify-center mt-2">
  <button 
    @click="handleSaveAndExit"
    class="text-blue-700 font-semibold cursor-pointer px-3 py-1 rounded hover:bg-blue-100 inline-block"
    style="font-size: 18px; margin-left: 22px;"
  >
    💾 Save and Exit
  </button>
</div>

</div>

      </div>

      <!-- RIGHT SIDE SYMBOLS -->
<!-- <div class="p-4 grid grid-cols-3 gap-2 border border-gray-300 overflow-y-auto"
     style="min-width: 220px; max-height: 500px;">
  <button
    v-for="symbol in symbols"
    :key="symbol.id"
    @click="assignSymbol(symbol)"
    class="border p-2 rounded text-lg hover:bg-gray-200"
  >
    {{ symbol.symbol }}
  </button>
</div> -->

<!-- RIGHT SIDE SYMBOLS -->
<div 
  class="p-4 grid grid-cols-3 gap-2 border border-gray-300 overflow-y-auto"
  style="min-width: 220px; max-height: 500px;"
>
  <button
    v-for="symbol in symbols"
    :key="symbol.id"
    draggable="true"
    @dragstart="handleDragStart(symbol, $event)"
    class="border p-2 rounded text-lg hover:bg-gray-200 cursor-move"
  >
    {{ symbol.symbol }}
  </button>
</div>

    </div>
    </div>

  </div>
</template>

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
    parsedParagraph() {
    const txt = (this.paragraphText || this.cleanedParagraph || '') + '';
    const parts = [];
    const regex = /\{\{(blank\d+)\}\}/gi; // matches {{blank1}}, {{blank2}}, ...
    let lastIndex = 0;
    let m;
    while ((m = regex.exec(txt)) !== null) {
      if (m.index > lastIndex) {
        parts.push({ type: 'text', text: txt.slice(lastIndex, m.index) });
      }
      parts.push({ type: 'blank', id: m[1] }); // e.g. {type:'blank', id:'blank1'}
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < txt.length) parts.push({ type: 'text', text: txt.slice(lastIndex) });
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
  const raw = event.dataTransfer.getData('application/json') || event.dataTransfer.getData('text/plain');
  if (!raw) return;

  let dropped;
  try { dropped = JSON.parse(raw); } catch (e) { dropped = { symbol: raw }; }
  
  const valueToSet = dropped.value ?? dropped.symbol ?? String(raw);

  const idx = this.iconBlanks.findIndex(b => b.id === blankId);
  if (idx !== -1) {
    this.$set(this.iconBlanks, idx, { ...this.iconBlanks[idx], value: valueToSet });
    console.log('Updated iconBlanks:', this.iconBlanks);
  }
}

,

    formattedParagraph() {
    if (!this.paragraphText) return '';
    console.log("Called.................");
    // Replace any "Blank" followed by a number with underscores
    return this.paragraphText.replace(/blank\d+/g, '_______');
  },

 handleDragStart(symbol, event) {
  console.log('dragstart symbol:', symbol);
  event.dataTransfer.setData('application/json', JSON.stringify(symbol));
  event.dataTransfer.setData('text/plain', symbol.symbol || symbol.value || '');
}
,
    handleDrop(index) {
      if (this.draggedSymbol) {
        this.$set(this.iconBlanks[index], 'value', this.draggedSymbol.symbol);
        this.draggedSymbol = null; // clear after drop
      }
    },
       handleSaveAndExit() {
    this.$emit('save-and-exit');
  },

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
      console.log("Next clicked");
      this.$emit('AnswerCheck')
    },
   getImgUrl(ImgName) {
            if (!ImgName) return "";
            var images = require.context('../assets/graphics/', false, /\.png$/);
            return images('./' + ImgName + ".png");
        },

getImgUrlByFileName(ImgName) {
  try {
    const fileName = sessionStorage.getItem('jsonFile');
    const images = require.context('../assets/graphics/', true, /\.png$/);
    const path = `./${fileName}/${ImgName}.png`;
    return images(path); // If it succeeds, return image path
  } catch (error) {
    return null; // If not an image, return null
  }
},

 toggleExerciseView() {
    this.showExerciseView = !this.showExerciseView;
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

/*
getBlankKey(n) {
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
*/

getBlankValue(id) {
  const b = (this.localBlanks || []).find(x => x.id === id);
  return b ? b.value : '';
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

  // 🔁 Auto-select next blank in the same group (same ID)
  const nextIndex = this.selectedBlankIndex + 1;
  const nextKey = this.getBlankKey(nextIndex);
  if (this.blanks[blankIdx][nextKey] !== undefined) {
    this.selectedBlankId = this.selectedBlankId;
    this.selectedBlankIndex = nextIndex;
  } else {
    // ❌ No more blanks in current group: clear selection
    this.selectedBlankId = null;
    this.selectedBlankIndex = null;
  }
}
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
