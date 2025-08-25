<template>
  <div class="flex-container"> 
    <div v-show="showBottom" class="responsive-grid">
      <div class="columns-wrapper" :class="getGridClass">
        <div 
          v-for="(column, colIndex) in columns" 
          :key="colIndex" 
          v-show="columnVisibility[colIndex]"
          class="column-wrapper"
        >
          <div class="column-title" :style="getTitleStyle(colIndex)">
            {{ columnTitles[colIndex] }}
          </div>
          <div class="column-container" :style="getColumnContainerStyle(colIndex)">
            <SVGImageButton 
              v-for="(item, itemIndex) in getDisplayItems(column, colIndex)"
              :key="`${colIndex}-${itemIndex}`"
              :identifier="itemIndex"
              :disable-correct="colIndex > 0"
              :accept-input="acceptInput"
              class="svg-button-wrapper"
            >
              <div
                class="column-item"
                :class="getColumnItemClass(colIndex, item, itemIndex)"
                @click="handleColumnClick(colIndex, itemIndex)"
              >
                {{ item.name }}
              </div> 
            </SVGImageButton> 
          </div>
        </div>
      </div>

      <div class="navigation-buttons">
        <!-- Previous Button -->
        <svg
          v-if="showPreviousButton"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-330 50 70 90"
          class="nav-button prev-button"
          filter="drop-shadow(0 0 4px gray)"
          transform="rotate(180)"
          @click="ClickPreviousButton"
        >
          <path
            d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z"
            stroke="#000"
            stroke-width="2"
            fill="#0369a1"
          />
        </svg>


 <!-- Save and Exit Button -->
            <!-- <div class="flex justify-center mt-2">
              <button
                @click="$emit('save-and-exit')"
                class="text-blue-700 font-semibold cursor-pointer px-3 py-1 rounded hover:bg-blue-100 inline-block"
                :style="{ fontSize: '18px', marginLeft: '22px' }"
                type="button"
              >
                💾 Save and Exit
              </button>
            </div> -->






            <SaveExitButton @save-and-exit="handleSaveAndExit" />



        <!-- Next Button -->
        <svg
          v-if="showNextButton"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-330 50 70 90"
          class="nav-button next-button"
          filter="drop-shadow(0 0 4px gray)"
          @click="ClickNextButton"
        >
          <path
            d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z"
            stroke="#000"
            stroke-width="2"
            fill="#0369a1"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import 'CSS/tailwind.css'
import SVGImageButton from 'Components/SVGImageButton'
import SaveExitButton from '../../../common-generic-templates/SaveExitButton.vue';


export default {
  name: 'SectionSem1Bottom',
  components: { SVGImageButton, SaveExitButton },
  
  props: {
    acceptInput: {
      type: Boolean,
      required: true
    },
    showNextButton: {
      type: Boolean,
      required: true
    },
    showPreviousButton: {
      type: Boolean,
      required: true
    },
    isReviewMode: {
      type: Boolean,
      default: false
    },
    Arrow_isShowing: {
      type: Boolean,
      required: true
    },
    columns: {
      type: Array,
      required: true,
      validator: value => Array.isArray(value) && value.every(col => Array.isArray(col))
    },
    columnTitles: {
      type: Array,
      required: true
    },
    columnVisibility: {
      type: Array,
      required: true,
      validator: value => Array.isArray(value) && value.every(vis => typeof vis === 'boolean')
    },
    rowCounts: {
      type: Array,
      required: true,
      validator: value => Array.isArray(value) && value.every(count => typeof count === 'number')
    },
    showBottom: {
      type: Boolean,
      default: true
    }
  },
  
  data() {
    return {
      clicked: false,
      dynamicRowCounts: [], // Track dynamic row counts per column
      minRows: 3 // Start with 3 empty rows
    }
  },
  
  mounted() {
    this.initializeDynamicRowCounts();
  },
  
  watch: {
    columns: {
      handler() {
        this.initializeDynamicRowCounts();
      },
      deep: true
    }
  },
  
  computed: {
    getGridClass() {
      const visibleColumns = this.columnVisibility.filter(Boolean).length;
      
      if (visibleColumns === 1) return 'grid-1-col';
      if (visibleColumns === 2) return 'grid-2-col';
      if (visibleColumns === 3) return 'grid-3-col';
      if (visibleColumns >= 4) return 'grid-4-col';
      
      return 'grid-1-col';
    }
  },
  
  methods: {

 handleSaveAndExit() {
            console.log("Save and exit clicked");
            this.$emit('save-and-exit');
        },

    initializeDynamicRowCounts() {
      // Initialize with minimum rows for each column
      this.dynamicRowCounts = this.columns.map((column, index) => {
        const filledItems = column.filter(item => item.name && item.name.trim() !== '').length;
        return Math.max(this.minRows, filledItems + 1); // Always show at least one empty row
      });
    },
    
    getDisplayItems(column, colIndex) {
      const currentRowCount = this.dynamicRowCounts[colIndex] || this.minRows;
      const displayItems = [];
      
      // Add existing items
      for (let i = 0; i < currentRowCount; i++) {
        if (i < column.length && column[i]) {
          displayItems.push(column[i]);
        } else {
          // Add empty placeholder
          displayItems.push({
            name: '',
            state: 'empty',
            isEmpty: true
          });
        }
      }
      
      return displayItems;
    },
    
    updateRowCount(colIndex) {
      if (!this.columns[colIndex]) return;
      
      const column = this.columns[colIndex];
      const filledItems = column.filter(item => item.name && item.name.trim() !== '').length;
      const currentRowCount = this.dynamicRowCounts[colIndex] || this.minRows;
      
      // If all visible rows are filled, add one more
      if (filledItems >= currentRowCount) {
        this.$set(this.dynamicRowCounts, colIndex, filledItems + 1);
      }
      // If we have too many empty rows (more than 2 empty at the end), reduce
      else if (filledItems < currentRowCount - 2 && currentRowCount > this.minRows) {
        this.$set(this.dynamicRowCounts, colIndex, Math.max(this.minRows, filledItems + 1));
      }
    },
    
    getTitleStyle(colIndex) {
      const baseStyle = {
        textAlign: 'center',
        border: '3px solid #2cb9fa',
        display: 'inline-block',
        backgroundColor: '#2cb9fa',
        color: 'white',
        fontWeight: 'bold'
      };
      
      return baseStyle;
    },
    
    getColumnContainerStyle(colIndex) {
      return {
        marginTop: '15px'
      };
    },
    
    getColumnItemClass(colIndex, item, itemIndex) {
      const baseClasses = {
        'cursor-not-allowed opacity-75': !this.acceptInput,
        clicked: this.clicked
      };
      
      // Handle empty slots - make them look like regular empty boxes
      if (item.isEmpty) {
        return {
          ...baseClasses,
          'empty-slot': true,
          'bg-white': true,
          'border-gray-300': true
        };
      }
      
      const stateClasses = {
        selected: 'border-blue-400 shadow-md',
        correct: colIndex === 0 ? 'bg-blue-200 border-blue-400 shadow-md' : 'bg-green-200 border-green-400 shadow-md',
        missed: 'bg-yellow-400 border-blue-600 shadow-md',
        incorrect: 'bg-red-400 border-red-600 shadow-md',
        unselected: 'bg-white',
        readonly: 'cursor-not-allowed opacity-75'
      };
      
      return {
        ...baseClasses,
        ...(item.state ? { [stateClasses[item.state]]: true } : { 'bg-white': true })
      };
    },
    
    handleColumnClick(colIndex, itemIndex) {
      if (this.acceptInput) {
        // Update row count after interaction
        this.$nextTick(() => {
          this.updateRowCount(colIndex);
        });
        
        this.$emit('OnClicked_Col', colIndex, itemIndex);
      }
    },
    
    ClickNextButton() {
      this.$emit('Click_NextButton');
    },
    
    ClickPreviousButton() {
      this.$emit('Click_PreviousButton');
    }
  }
}
</script>

<style scoped>
.flex-container {
  display: flex;
  justify-content: center;
  margin: auto;
  width: 100%;
  padding: 0 10px;
}

.responsive-grid {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.columns-wrapper {
  display: grid;
  gap: 20px;
  margin: 20px auto;
  justify-content: center;
  align-items: start;
}

/* Dynamic Grid Classes Based on Column Count */
.grid-1-col {
  grid-template-columns: 1fr;
  max-width: 280px;
}

.grid-2-col {
  grid-template-columns: repeat(2, 1fr);
  max-width: 580px;
}

.grid-3-col {
  grid-template-columns: repeat(2, 1fr);
  max-width: 580px;
}

.grid-4-col {
  grid-template-columns: repeat(2, 1fr);
  max-width: 580px;
}

.column-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 250px;
  justify-self: center;
}

.column-title {
  text-align: center;
  border: 3px solid #2cb9fa;
  display: inline-block;
  width: 100%;
  max-width: 250px;
  min-height: 35px;
  background-color: #2cb9fa;
  color: white;
  font-weight: bold;
  padding: 8px 10px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.2;
}

.column-container {
  margin-top: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.svg-button-wrapper {
  margin-bottom: 5px;
  padding: 0;
  width: 100%;
  max-width: 250px;
}

.column-item {
  text-align: center;
  width: 100%;
  height: 35px;
  font-size: 16px;
  border: 1px solid #e5e7eb;
  padding: 5px 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: white;
}

.column-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Empty slot styling - looks like regular empty boxes */
.column-item.empty-slot {
  background-color: white;
  border: 1px solid #e5e7eb;
}

.column-item.empty-slot:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navigation-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
  margin: 30px 0;
}

.nav-button {
  height: 50px;
  width: 60px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.nav-button:hover {
  opacity: 0.8;
}

/* Tablet Adjustments */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .grid-3-col {
    grid-template-columns: repeat(3, 1fr);
    max-width: 800px;
  }
  
  .grid-4-col {
    grid-template-columns: repeat(3, 1fr);
    max-width: 800px;
  }
}

/* Large Desktop Adjustments */
@media screen and (min-width: 1025px) {
  .grid-3-col {
    grid-template-columns: repeat(3, 1fr);
    max-width: 850px;
  }
  
  .grid-4-col {
    grid-template-columns: repeat(4, 1fr);
    max-width: 1100px;
  }
  
  .column-wrapper {
    min-width: 260px;
  }
  
  .column-title {
    max-width: 260px;
    font-size: 15px;
  }
  
  .svg-button-wrapper {
    max-width: 260px;
  }
  
  .column-item {
    font-size: 17px;
    height: 38px;
  }
}

/* Mobile Responsive */
@media screen and (max-width: 768px) {
  .grid-1-col,
  .grid-2-col,
  .grid-3-col,
  .grid-4-col {
    grid-template-columns: 1fr;
    max-width: 300px;
  }
  
  .column-wrapper {
    min-width: 100%;
  }
  
  .column-title {
    font-size: 13px;
    max-width: 280px;
  }
  
  .column-item {
    font-size: 14px;
    height: 32px;
  }
  
  .svg-button-wrapper {
    max-width: 280px;
  }
  
  .navigation-buttons {
    gap: 20px;
    margin: 20px 0;
  }
  
  .nav-button {
    height: 40px;
    width: 50px;
  }
}
</style>
