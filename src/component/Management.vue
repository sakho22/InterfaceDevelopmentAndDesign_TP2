
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const activeUser = computed(() => store.state.user.activeUser);
const groupsOfSeven = computed(() => Math.floor((activeUser.value?.workers || 0) / 7));

const activateManager = (index) => {
    store.commit('ACTIVATE_MANAGER', index);
    store.commit('SAVE_GAME');
};
</script>

<template>
    <div class="management-panel">
        <h2>Human Resources</h2>
        <p>Total Workers: <strong>{{ activeUser.workers }}</strong> ({{ groupsOfSeven }} Complete Groups)</p>
        <p>Managers Hired: <strong>{{ activeUser.managers.length }} / {{ groupsOfSeven }}</strong></p>
        
        <hr style="margin: 15px 0;">

        <div v-if="activeUser.managers.length === 0">
            <p>You have no managers yet. Hire 7 workers to unlock your first manager slot!</p>
        </div>

        <div v-for="(manager, index) in activeUser.managers" :key="index" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>Manager {{ index + 1 }} (Group {{ index + 1 }})</strong><br>
                <span v-if="manager.activeTimeLeft > 0" style="color: #4CAF50;">Boost Active: {{ manager.activeTimeLeft }}s</span>
                <span v-else-if="manager.cooldownLeft > 0" style="color: grey;">Cooldown: {{ manager.cooldownLeft }}s</span>
                <span v-else style="color: gray;">Ready for deployment</span>
            </div>
            
            <button 
                @click="activateManager(index)"
                :disabled="manager.activeTimeLeft > 0 || manager.cooldownLeft > 0"
            >
                Activate Boost
            </button>
        </div>
    </div>
</template>