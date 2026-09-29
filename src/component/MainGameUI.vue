
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const activeUser = computed(() => store.state.user.activeUser);
const productionRate = computed(() => store.getters.currentProductionRate);

const emit = defineEmits(['open-store', 'open-management', 'open-leaderboard', 'open-admin']);

const manualClick = () => {
    store.commit('MANUAL_CLICK');
    store.commit('SAVE_GAME'); 
};
</script>

<template>
    <div class="main-ui-panel" style="padding: 20px;">
        <h1>Welcome, {{ activeUser.username }}!</h1>
        
        <div class="stats-panel">
            <h2>Flowers: {{ activeUser.flowers.toFixed(5) }}</h2>
            <p>Manual Click Rate: {{ activeUser.clickRate.toFixed(5) }}</p>
            <p>Auto Production: {{ productionRate.toFixed(5) }} / sec</p>
            <p>Workers Hired: {{ activeUser.workers }}</p>
            <p>Worker Efficiency: {{ (activeUser.workerEfficiency * 100).toFixed(0) }}%</p>
        </div>
        
        <br>
        <button @click="manualClick" style="padding: 20px; font-size: 1.2rem; cursor: pointer;">
            🌸 Harvest Flower 🌸
        </button>

        <hr style="margin: 30px 0;">
        
        
        <button @click="emit('open-store')" class="nav-btn">Store</button>
        <button @click="emit('open-management')"  class="nav-btn">Human Resources</button>
        <button @click="emit('open-leaderboard')"  class="nav-btn">Leaderboard</button>

        <button 
            v-if="activeUser.role === 'Admin'" 
            @click="emit('open-admin')" 
            class="nav-btn admin-btn"
        >
            Admin Panel
        </button>
    </div>
</template>

<style scoped>
    .nav-btn {
        margin: 0 5px;
        cursor: pointer;
    }

    .admin-btn { 
        background-color: #333; 
        color: white; 
        border: none; 
        border-radius: 5px;
        padding: 5px 10px; 
    }
</style>