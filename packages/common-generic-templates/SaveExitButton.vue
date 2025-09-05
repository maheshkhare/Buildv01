<!-- <template>
  <div class="flex justify-center mt-2">
    <button
      @click="$emit('save-and-exit')"
      class="text-blue-700 font-semibold cursor-pointer px-3 py-1 rounded hover:bg-blue-100 inline-block"
      :style="{ fontSize: '18px', marginLeft: '22px' }"
      type="button"
    >
      💾 Save and Exit
    </button>
  </div>
</template>

<script>
export default {
  name: 'SaveExitButton',
};
</script> -->


<template>
  <div class="flex flex-col items-center mt-2">
    <!-- Save & Exit Button -->
    <button
      @click="showPopup = true"
      class="text-blue-700 font-semibold cursor-pointer px-3 py-1 rounded hover:bg-blue-100"
      :style="{ fontSize: '18px', marginLeft: '22px' }"
      type="button"
    >
      💾 Save and Exit
    </button>

    <!-- Confirmation Popup -->
    <transition name="fade">
      <div
        v-if="showPopup"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div class="bg-white rounded-lg p-6 shadow-lg w-80 text-center">
          <p class="mb-4 font-medium">Do you want to save your progress and exit?<br />
            Click <strong>Yes</strong> to save and exit, or <strong>No</strong> to continue.</p>
          <div class="flex justify-around mt-4">
            <button
              @click="confirmSaveExit"
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Yes
            </button>
            <button
              @click="cancelSaveExit"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SaveExitButton',
  data() {
    return {
      showPopup: false, // controls popup visibility
    };
  },
  methods: {
    confirmSaveExit() {
      this.showPopup = false;
      this.$emit('save-and-exit'); // emit only if Yes clicked
    },
    cancelSaveExit() {
      this.showPopup = false; // hide popup if No clicked
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
