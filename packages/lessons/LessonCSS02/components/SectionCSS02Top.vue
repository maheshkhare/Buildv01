<template>
 <div class="flex-container">
     <div class="grid grid-cols-1 justify-center" >
   
   <div class="grid grid-rows-3 grid-flow-col gap-4">
  <div class="row-span-3 ...">
    <span v-html="BuildingShape"></span>
    
    <!-- Elevator with door animation -->
    <div class="elevator-container" :style="elevatorContainerStyle">
      <svg id="temp0001-Page%201" :viewBox="DoorShape" style="background-color:#ffffff00" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" x="0px" y="0px" width="30px" height="24px">
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="52.0833%" x2="100%" y2="52.0833%">
            <stop stop-color="#000000" stop-opacity="1" offset="0%"/>
            <stop stop-color="#ffffff" stop-opacity="1" offset="100%"/>
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="52.0833%" x2="0%" y2="52.0833%">
            <stop stop-color="#000000" stop-opacity="1" offset="0%"/>
            <stop stop-color="#ffffff" stop-opacity="1" offset="100%"/>
          </linearGradient>
        </defs>
        
        <!-- Elevator Base -->
        <path d="M 0 0 L 30 0 L 30 24 L 0 24 L 0 0 Z" stroke="#000000" stroke-width="1" fill="#cccccc"/>
        <path d="M 3.75 19 L 26.25 19 L 30 24 L 0 24 L 3.75 19 Z" stroke="#000000" stroke-width="1" fill="#cccccc"/>
        <path d="M 3.75 6.25 L 26.25 6.25 L 30 0 L 0 0 L 3.75 6.25 Z" stroke="#000000" stroke-width="1" fill="#cccccc"/>
        
        <!-- Elevator Interior (will change color) -->
        <path d="M 3.75 5 L 26.25 5 L 26.25 20.25 L 3.75 20.25 L 3.75 5 Z" stroke="#000000" stroke-width="1" :fill="currentElevatorColor"/>
        
        <!-- Left Door -->
        <path d="M 0 0 L 15 1.0417 L 15 22.9583 L 0 24 L 0 0 Z" 
              stroke="#000000" 
              stroke-width="1" 
              fill="url(#gradient1)"
              :transform="leftDoorTransform"
              class="door-transition"/>
        
        <!-- Right Door -->
        <path d="M 30 24 L 15 22.9583 L 15 1.0417 L 30 0 L 30 24 Z" 
              stroke="#000000" 
              stroke-width="1" 
              fill="url(#gradient2)"
              :transform="rightDoorTransform"
              class="door-transition"/>
      </svg>
      
      <!-- Status Indicator -->
      <div v-if="showStatus" class="status-indicator" :class="statusClass">
        {{ statusText }}
      </div>
    </div>
    
    <svg xmlns="http://www.w3.org/2000/svg" :viewBox="ArrowDny" height="50" width="50" filter="drop-shadow(0 0 4px gray)">
      <path d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z" stroke="#000" stroke-width="2" fill="white" />
    </svg>
  </div>
  
  <div class="row-span-3 col-span-2 ..." v-show="UpDownAns" v-bind:style="{ border: activeColor }">
    <div class="ml-10">
      <div class="grid grid-cols-1 gap-4 mt-8" style="border:2px solid black; width:105px;">
        <p><center>UP</center></p>
        <SVGImageButton
          v-for="shape in RedCircles.slice(0,5)"
          :key="shape.index"
          :identifier="shape.index"
          :disable-correct="true"
          :accept-input="acceptInput"
          :disable-border="true"
          class="rounded-md"
          style="border-width: 0px; padding: 0px; z-index: 10;">
          <span v-html="shape.svg" v-on:click="CollectAns(shape.Answer)" style="margin-left:-20px;"></span>
          <span v-html="shape.svgUp" v-on:click="CollectAns(shape.Answer)" style="margin-left:-20px;"></span>
          <span v-html="shape.Number" v-on:click="CollectAns(shape.Answer)" style="margin-left:-20px;"></span>
        </SVGImageButton>
      </div>

      <div class="grid grid-cols-1 gap-4 mt-6" style="border:2px solid black; width:105px;">
        <SVGImageButton
          v-for="shape in RedCircles.slice(5,10)"
          :key="shape.index"
          :identifier="shape.index"
          :disable-correct="true"
          :accept-input="acceptInput"
          :disable-border="true"
          class="rounded-md"
          style="border-width: 0px; padding: 0px; z-index: 10;">
          <span v-html="shape.svg" v-on:click="CollectAns(shape.Answer)" style="margin-left:-20px;"></span>
          <span v-html="shape.svgDown" v-on:click="CollectAns(shape.Answer)" style="margin-left:-20px;"></span>
          <span v-html="shape.Number" v-on:click="CollectAns(shape.Answer)" style="margin-left:-20px;"></span>
        </SVGImageButton>
        <p><center>Down</center></p>
      </div>
    </div>
  </div>
</div>

<div v-show="ArrawShowHide" style="z-index: 10;">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-300 100 181 90" height="50" width="150" filter="drop-shadow(0 0 4px gray)">
    <path d="M117.2 23.2H4.5v43.5h112.7v18.1l59.3-39.9L117.2 5v18.1z" stroke="#000" stroke-width="2" fill="yellow"
      class="submit-selections" :class="{ clicked: clicked }" v-on:click="NewQuestion()"/>
  </svg>   
</div>

<div class="grid grid-rows-0 grid-flow-col ml-auto mr-auto mt-5" v-show="ProressCounter" style="width:auto;">
  <p class="font-bold ml-auto mr-auto">Question - <span class="text-indigo-700">{{Questions_attempted+1}}</span> of <span class="text-indigo-700">{{ Total_Questions }}</span></p>      
</div>

</div>
</div>
</template>

<script>
import 'CSS/tailwind.css'
import SVGShape from 'Components/SVGShape'
import SVGImageButton from 'Components/SVGImageButton'

export default {
  name: 'SectionCSS02SecondPractice',
  components: { SVGImageButton, SVGShape },
  props: {
    highlight: {
      type: Boolean,
      default: false
    },
    ProgressBar: {
      type: Array,
      required: true
    },
    Total_Questions: {
      type: String,
      required: true
    },
    Questions_attempted: {
      type: String,
      required: true
    },
    BuildingShape: {
      type: String,
      required: true
    },
    DoorShape: {
      type: String,
      required: true
    },
    DoorColor: {
      type: String,
      required: true
    },
    ArrawShowHide: {
      type: Boolean
    },
    ProressCounter: {
      type: Boolean
    },
    introductionTitle: {
      type: String,
      required: true
    },
    UpDownAns: {
      type: Boolean
    },
    ProgressBarHide: {
      type: Boolean
    },
    ArrowDny: {
      type: String,
      required: true
    },
    Arrow: {
      type: String,
      required: true
    },
    RedCircles: {
      type: Array,
      required: true
    },
    activeColor: {
      type: String,
      required: true
    },
    acceptInput: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      currentElevatorColor: '#999999', // Default color
      doorsOpen: false,
      leftDoorTransform: 'translate(0, 0)',
      rightDoorTransform: 'translate(0, 0)',
      showStatus: false,
      statusText: '',
      statusClass: '',
      doorAnimationTimeout: null,
      isAnimating: false,
      lastProcessedColor: ''
    }
  },
  computed: {
    elevatorContainerStyle() {
      return {
        position: 'relative',
        display: 'inline-block'
      }
    }
  },
  watch: {
    DoorColor: {
      immediate: true,
      handler(newColor) {
        // Only process if color changed and it's a result color
        if (newColor !== this.lastProcessedColor && (newColor === 'green' || newColor === 'red')) {
          this.lastProcessedColor = newColor
          this.handleElevatorAnimation(newColor)
        } else if (newColor === '#999999' || !newColor) {
          // Reset when color goes back to default
          this.lastProcessedColor = ''
          this.resetElevator()
        }
      }
    }
  },
  methods: {
    CollectAns(index) {
      // Reset animation state before new answer
      this.resetElevator()
      this.$emit('CollectAns', index)
    },
    NewQuestion() {
      // Reset elevator state for new question
      this.resetElevator()
      this.$emit('NewQuestion')
    },
    handleElevatorAnimation(resultColor) {
      // Don't start new animation if already animating
      if (this.isAnimating) {
        return
      }

      // Clear any existing animation
      this.clearAnimationTimeouts()

      this.isAnimating = true
      
      // Set elevator color based on result
      this.currentElevatorColor = resultColor === 'green' ? '#4ade80' : '#ef4444'
      
      // Set status text and class
      this.statusText = resultColor === 'green' ? '✓ Correct' : '✗ Wrong'
      this.statusClass = resultColor === 'green' ? 'status-correct' : 'status-wrong'
      
      // Open doors after a small delay to show movement
      setTimeout(() => {
        this.openDoors()
        
        // Close doors after delay and reset
        this.doorAnimationTimeout = setTimeout(() => {
          this.closeDoors()
          
          // Reset color after animation completes
          this.doorAnimationTimeout = setTimeout(() => {
            this.currentElevatorColor = '#999999'
            this.showStatus = false
            this.isAnimating = false
            this.lastProcessedColor = ''
          }, 500)
        }, 1500)
      }, 300)
    },
    openDoors() {
      this.doorsOpen = true
      this.leftDoorTransform = 'translate(-8, 0)'
      this.rightDoorTransform = 'translate(8, 0)'
      this.showStatus = true
    },
    closeDoors() {
      this.doorsOpen = false
      this.leftDoorTransform = 'translate(0, 0)'
      this.rightDoorTransform = 'translate(0, 0)'
    },
    resetElevator() {
      this.currentElevatorColor = '#999999'
      this.doorsOpen = false
      this.leftDoorTransform = 'translate(0, 0)'
      this.rightDoorTransform = 'translate(0, 0)'
      this.showStatus = false
      this.isAnimating = false
      this.lastProcessedColor = ''
      this.clearAnimationTimeouts()
    },
    clearAnimationTimeouts() {
      if (this.doorAnimationTimeout) {
        clearTimeout(this.doorAnimationTimeout)
        this.doorAnimationTimeout = null
      }
    }
  },
  beforeDestroy() {
    this.clearAnimationTimeouts()
  }
}
</script>

<style scoped>
.flex-container {
  display: flex;
  justify-content: center;
  margin: auto;
}

.door-transition {
  transition: transform 0.5s ease-in-out;
}

.status-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
  z-index: 20;
  animation: fadeInOut 2s ease-in-out;
}

.status-correct {
  background-color: #4ade80;
  color: white;
}

.status-wrong {
  background-color: #ef4444;
  color: white;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}

.elevator-container {
  position: relative;
}
</style>