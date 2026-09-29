
<script setup>
import { ref } from 'vue';

const props = defineProps({
    title: String,
    initialX: { type: Number, default: 50 },
    initialY: { type: Number, default: 50 },
    zIndex: { type: Number, default: 100 }
});

const emit = defineEmits(['close', 'focus']);


const x = ref(props.initialX);
const y = ref(props.initialY);
const isDragging = ref(false);


let startMouseX = 0;
let startMouseY = 0;
let startWinX = 0;
let startWinY = 0;

const startDrag = (e) => {
    isDragging.value = true;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    startWinX = x.value;
    startWinY = y.value;
    
    emit('focus'); 
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
};

const drag = (e) => {
    if (!isDragging.value) return;
    
    x.value = startWinX + (e.clientX - startMouseX);
    y.value = startWinY + (e.clientY - startMouseY);
};

const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
};
</script>

<template>
    <div 
        class="draggable-window" 
        :style="{ top: `${y}px`, left: `${x}px`, zIndex: zIndex }"
        @mousedown="emit('focus')"
    >
        
        <div class="window-header" @mousedown="startDrag">
            <strong>{{ title }}</strong>
            <button @click.stop="emit('close')" class="close-btn">X</button>
        </div>
        
        
        <div class="window-content">
            <slot></slot> 
        </div>
    </div>
</template>

<style scoped>
.draggable-window {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    width: 400px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
}

.window-header {
    background: #f1f1f1;
    padding: 10px;
    cursor: grab;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none; 
}

.window-header:active {
    cursor: grabbing;
}

.window-content {
    padding: 15px;
    overflow-y: auto;
}

.close-btn {
    background-color: #f1f1f1;
    border: none;
    width: 25px;
    height: 25px;
    cursor: pointer;
}

.close-btn:hover {
    text-decoration: underline;
}
</style>