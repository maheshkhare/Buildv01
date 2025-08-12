<template> 
  <div class="w-full main-bg">
    <div class="rows-12">
      <topHeader
        :HeaderTop="HeaderTop"
        :componentSubtitle="componentSubtitle"
      />
      <div class="story-content">
        <!-- Image Display -->
        <div class="image-container" v-if="image">
          <img :src="getImagePath(image)" :alt="'Story illustration: ' + HeaderTop" />
        </div>
        
        <!-- Story Text -->
        <div class="story-text bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-md my-4">
          <h2 class="text-lg font-bold mb-2">Story Section</h2>
          <p class="whitespace-pre-line">{{ story }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SectionStory1',
  props: {
    story: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    jsonFileName: sessionStorage.getItem('jsonFile') || 'lesson1',

      HeaderTop: 'Story Section',
      componentSubtitle: 'A Short Story Preview'
    }
  },
  methods: {
//     getImagePath(imageName) {


//       return require(`../assets/graphics/${imageName}.png`);

      
//     }
// ,
    getImagePath(imageName)
    {  try {
          // console.log(`image path: ${this.folder}`);
        const folder = `./graphics${this.jsonFileName}/`
        const images = require.context('../assets/', true, /\.png$/)
        return images(`${folder}${imageName}.png`)

      } catch (e) {
        console.error(`Image not found: graphics${this.jsonFileName}/${imageName}.png`)
        return ''
      }
    },
  }
}
</script>

<style scoped>
.story-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.image-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.image-container img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.story-text {
  line-height: 1.6;
}

p {
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 20px;
  color: #333;
  white-space: pre-line;
}

@media (min-width: 768px) {
  .story-content {
    flex-direction: row;
    align-items: flex-start;
  }
  
  .image-container {
    flex: 0 0 40%;
    position: sticky;
    top: 1rem;
  }
  
  .story-text {
    flex: 1;
  }
}
</style>