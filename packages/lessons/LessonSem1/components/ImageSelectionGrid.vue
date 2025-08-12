<template>
  <div class="image-grid-wrapper">
    <div class="image-grid">
      <div
        v-for="(item, index) in imageItems"
        :key="index"
        class="image-grid-item"
        :class="{
          'selected-image': selectedWord === item.word,
          'disabled-image': placedWords.includes(item.word)
        }"
        @click="handleImageClick(item)"
        tabindex="0"
        role="button"
        :aria-pressed="selectedWord === item.word"
      >
        <template v-if="!brokenImages[index]">
          <img
            :src="getImagePath(item.image)"
            :alt="item.word"
            @error="onImageError(index)"
          />
        </template>
        <template v-else>
          <div class="image-placeholder">
            Image not present right now
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageSelectionGrid',
  props: {
    imageItems: Array,
    placedWords: Array
  },
  data() {
    return {
      selectedWord: null,
      brokenImages: [] // Tracks missing images by index
    }
  },
  methods: {
    getImagePath(imageFileName) {
      // If using Vue CLI/Webpack, this works (adjust if using Vite or absolute/public)
      try {
        return require(`../assets/graphicsEMU-CSI/${imageFileName}`);
      } catch (e) {
        // Will also fallback to placeholder if image not found at build time
        return '';
      }
    },
    handleImageClick(item) {
      if (this.placedWords.includes(item.word)) return;
      this.selectedWord = this.selectedWord === item.word ? null : item.word;
      this.$emit('word-selected', this.selectedWord);
    },
    onImageError(index) {
      this.$set(this.brokenImages, index, true);
    }
  }
};
</script>

<style scoped>
.image-grid-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.image-grid {
  border: black 2px solid;
  border-radius: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px 24px;
  max-width: 480px;
  width: 100%;
  justify-content: center;
}

.image-grid-item {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(90 90 90 / 0.10);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 10px 8px 10px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
  min-height: 150px;
}

.image-grid-item img {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 10px;
  background: #f5f5f5;
}

.selected-image {
  border-color: #2cb9fa;
  background: #e9f7fd;
}

.disabled-image {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-placeholder {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #8d8d8d;
  background: #f0f0f0;
  border-radius: 10px;
  border: 1px dashed #bbb;
  text-align: center;
  padding: 10px;
}

@media (max-width: 600px) {
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 320px;
    gap: 12px 12px;
  }
}
</style>
