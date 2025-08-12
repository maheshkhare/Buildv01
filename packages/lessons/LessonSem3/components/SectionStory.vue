<template>
  <div class="story-container">
    <h2 class="story-title">{{ HeaderTop }}</h2>
    <p class="story-subtitle">{{ componentSubtitle }}</p>
    
    <div class="story-content">
      <p class="story-text">{{ paraData }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SectionStory',
  props: {
    paraData: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      HeaderTop: 'Story Section',
      componentSubtitle: 'Read carefully before answering'
    }
  }
}
</script>

<style scoped>
.story-container {
  background-color: #fef3c7; /* Light yellow background */
  border: 1px solid #f59e0b; /* Amber border */
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.story-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #92400e; /* Dark amber text */
  margin: 0 0 4px 0;
}

.story-subtitle {
  font-size: 0.875rem;
  color: #b45309; /* Medium amber text */
  margin: 0 0 12px 0;
}

.story-content {
  max-height: 300px; /* Fixed height for scroll */
  overflow-y: auto;  /* Vertical scroll only */
  padding-right: 8px; /* Prevents text from touching scrollbar */
}

.story-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  white-space: pre-line; /* Preserves line breaks from JSON */
  margin: 0;
}

/* Custom Scrollbar Styling */
.story-content::-webkit-scrollbar {
  width: 8px; /* Slim scrollbar */
}

.story-content::-webkit-scrollbar-thumb {
  background: #f59e0b; /* Amber scroll handle */
  border-radius: 4px;
}

.story-content::-webkit-scrollbar-track {
  background: #fef3c7; /* Matches container background */
}

/* Firefox scrollbar */
.story-content {
  scrollbar-width: thin;
  scrollbar-color: #f59e0b #fef3c7;
}
</style>