// Get random  int between min and max inclusive
export function randomNumberGenerator(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function getRandomShapes(count, includeVariants) {
  let baseShapes = ['circle', 'square', 'triangle', 'diamond', 'hexagon']
  let variants = ['rectangle', 'oval']
  let shapes = includeVariants ? [...baseShapes, ...variants] : baseShapes
  let returnArray = []
  for (let i = 0; i < count; i++) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let shape = shapes[randomNumberGenerator(0, shapes.length - 1)]
      if (
        !returnArray.includes(shape) ||
        (count > shapes.length && returnArray[returnArray.length - 1] !== shape)
      ) {
        returnArray.push(shape)
        break
      }
    }
  }
  return returnArray
}

export function capitalizeFirstLetter(inputString) {
  return `${inputString.charAt(0).toUpperCase()}${inputString.substr(1)}`
}

/* takes fileList as Array of string filenames, or Objects with field fileName
and optionally field howlName if a differently named howl reference is desired.
 */
import { Howl } from 'howler'
export function generateLessonHowls(fileList, lessonName, language) {
  let returnObject = {}
  fileList.forEach((fileData) => {
    const fileName = `${fileData.fileName || fileData}`
    const filePath = `${lessonName}/assets/audio/${
      language || 'en'
    }/${fileName}`
    const howlName = fileData.howlName || fileData.fileName || fileData
    returnObject[howlName] = new Howl({
      src: [
        require(`Lessons/${filePath}.ogg`),
        require(`Lessons/${filePath}.mp3`)
      ]
    })
  })
  return returnObject
}
