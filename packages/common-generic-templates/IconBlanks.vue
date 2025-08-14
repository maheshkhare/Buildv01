<template>
<div class="flex flex-wrap gap-4 mb-6">
    <div v-for="(box, index) in iconBlanks" :key="box.id" @click="!box.value && $emit('select', box, index)" @dragover.prevent @drop="onDrop(index, $event)" class="flex items-center border-2 border-dashed border-gray-400 px-4 py-2 rounded cursor-pointer" :class="{ 'ring-2 ring-blue-400': selectedIconBox === box.id }" :ref="`blankBox_${index}`">
        <img :src="getImgUrlByFileName(box.symbol)" alt="icon" class="w-8 h-8 mr-4 object-contain" />
        <span class="border-b-2 border-black px-4">
            {{ box.value || '____' }}
        </span>
    </div>
</div>
</template>

<script>
export default {
    props: {
        iconBlanks: Array,
        selectedIconBox: [String, Number],
        getImgUrlByFileName: Function
    },
    methods: {
        onDrop(index, event) {
            try {
                event.dataTransfer.dropEffect = 'move';
                const raw =
                    event.dataTransfer.getData('application/json') ||
                    event.dataTransfer.getData('text/plain');

                if (!raw) return;
                const parsed = JSON.parse(raw); // { id, symbol, ... }
                const symbol = parsed.symbol ?? parsed.value ?? parsed; // fallback

                this.$emit('dropSymbol', {
                    index,
                    symbol: {
                        symbol
                    }
                });
            } catch (err) {
                console.error('Invalid drop data:', err);
            }
        }
    }
}
</script>
