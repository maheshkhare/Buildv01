<template>
<div class="p-4 grid grid-cols-3 gap-2 border border-gray-300 overflow-y-auto" style="min-width: 220px; max-height: 500px;">
    <button v-for="symbol in symbols" :key="symbol.id" draggable="true" @dragstart="onDragStart(symbol, $event)" class="border p-2 rounded text-lg hover:bg-gray-200 cursor-move">
        {{ symbol.symbol }}
    </button>
</div>
</template>

<script>
export default {
    props: {
        symbols: Array
    },
    methods: {
        onDragStart(symbol, event) {
            const payload = JSON.stringify(symbol);
            event.dataTransfer.effectAllowed = 'move';
            // write BOTH – some environments only allow text/plain:
            event.dataTransfer.setData('application/json', payload);
            event.dataTransfer.setData('text/plain', payload);
        }
    }
}
</script>
