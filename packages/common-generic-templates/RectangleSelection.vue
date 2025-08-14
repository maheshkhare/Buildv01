<template>
<div class="w-full flex flex-col items-center">
    <h5 class="mb-4 text-lg font-bold bg-gray-100 p-4 rounded text-gray-800">
        {{ instruction }}
    </h5>

    <div class="flex flex-wrap gap-4 mb-8">
        <div v-for="(rect, idx) in rectangles" :key="idx" @click="$emit('selectRectangle', idx)" class="border-2 border-dashed p-4 w-20 h-21 flex flex-col justify-center items-center rounded cursor-pointer" :class="{ 'ring-2 ring-blue-400': selectedIndex === idx }">
            <div v-if="getImgUrlByFileName(rect.symbol)">
                <img :src="getImgUrlByFileName(rect.symbol)" class="mb-2" />
            </div>
            <div v-else>
                <span class="mt-4 text-2xl mb-2">{{ rect.symbol }}</span>
            </div>
            <span class="text-xl font-bold">
                {{ (rect.chosenOption && rect.chosenOption.letter) || '____' }}
            </span>

        </div>
    </div>

    <div class="grid grid-cols-5 gap-4">
        <button v-for="(opt, idx) in options" :key="idx" @click="$emit('assignOption', opt)" class="border px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">
            {{ opt.letter }}
        </button>
    </div>
</div>
</template>

<script>
export default {
    props: {
        instruction: String,
        rectangles: Array,
        options: Array,
        selectedIndex: Number,
        getImgUrlByFileName: Function
    }
}
</script>
