
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';
import MainGameUI from '../component/MainGameUI.vue';
import StoreComponent from '../component/Store.vue';
import ManagementComponent from '../component/Management.vue';
import DraggableWindow from '../component/DraggableWindow.vue'; 
import LeaderboardComponent from '../component/Leaderboard.vue';
import AdminPanelComponent from '../component/AdminPanel.vue';

const store = useStore();
const activeUser = computed(() => store.state.user.activeUser);


const isStoreOpen = ref(false);
const isManagementOpen = ref(false);
const isLeaderboardOpen = ref(false);
const isAdminOpen = ref(false);


const baseZIndex = 100;
const storeZ = ref(baseZIndex);
const managementZ = ref(baseZIndex);
const leaderboardZ = ref(baseZIndex);
const adminZ = ref(baseZIndex);
let highestZ = baseZIndex;

const focusWindow = (windowName) => {
    highestZ++;
    if (windowName === 'store') storeZ.value = highestZ;
    if (windowName === 'management') managementZ.value = highestZ;
    if (windowName === 'leaderboard') leaderboardZ.value = highestZ;
    if (windowName === 'admin') adminZ.value = highestZ;
};

const openStore = () => {
    isStoreOpen.value = true;
    focusWindow('store');
};

const openManagement = () => {
    isManagementOpen.value = true;
    focusWindow('management');
};

const openLeaderboard = () => {
    isLeaderboardOpen.value = true;
    focusWindow('leaderboard');
}

const openAdmin = () => { 
    isAdminOpen.value = true; 
    focusWindow('admin'); 
};


onMounted(() => {
    if (activeUser.value) store.dispatch('startAutoProduction');
});

onUnmounted(() => {
    store.dispatch('stopAutoProduction');
});
</script>

<template>
    <div v-if="activeUser" class="game-container">
        
        
        <MainGameUI 
            @open-store="openStore" 
            @open-management="openManagement" 
            @open-leaderboard="openLeaderboard"
            @open-admin="openAdmin"
        />

        
        <DraggableWindow 
            v-if="isStoreOpen" 
            title="Upgrade Store" 
            :initialX="100" 
            :initialY="100"
            :zIndex="storeZ"
            @close="isStoreOpen = false"
            @focus="focusWindow('store')"
        >
            <StoreComponent></StoreComponent>
        </DraggableWindow>

        
        <DraggableWindow 
            v-if="isManagementOpen" 
            title="Human Resources" 
            :initialX="550" 
            :initialY="150"
            :zIndex="managementZ"
            @close="isManagementOpen = false"
            @focus="focusWindow('management')"
        >
            <ManagementComponent></ManagementComponent>
        </DraggableWindow>
        <DraggableWindow 
            v-if="isLeaderboardOpen" 
            title="Leaderboard" 
            :initialX="300" 
            :initialY="200"
            :zIndex="leaderboardZ"
            @close="isLeaderboardOpen = false"
            @focus="focusWindow('leaderboard')"
        >
            <LeaderboardComponent></LeaderboardComponent>
        </DraggableWindow>

        <DraggableWindow 
            v-if="isAdminOpen" 
            title="Admin Panel" 
            :initialX="400" 
            :initialY="50"
            :zIndex="adminZ"
            @close="isAdminOpen = false"
            @focus="focusWindow('admin')"
        >
            <AdminPanelComponent></AdminPanelComponent>
        </DraggableWindow>

    </div>
    
    <div v-else>
        <p>You are not logged in. Please go back and log in.</p>
    </div>
</template>
<style scoped>
.game-container {
    position: relative; 
    width: 100vw; 
    height: 100vh; 
    overflow: hidden;
    background-color: white;
}
</style>