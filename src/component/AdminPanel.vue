
<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const users = computed(() => store.state.user.users);


const newScores = ref({});

const setScore = (username) => {
    const score = newScores.value[username];
    if (score !== undefined && score !== '') {
        store.commit('ADMIN_SET_SCORE', { username, newScore: parseFloat(score) });
        store.commit('SAVE_GAME');
        newScores.value[username] = ''; 
    }
};

const resetUser = (username) => {
    if (confirm(`Are you sure you want to reset ${username}'s game?`)) {
        store.commit('ADMIN_RESET_USER', username);
        store.commit('SAVE_GAME');
    }
};

const deleteUser = (username) => {
    if (confirm(`Are you sure you want to permanently delete ${username}?`)) {
        store.commit('ADMIN_DELETE_USER', username);
        store.commit('SAVE_GAME');
    }
};
</script>

<template>
    <div class="admin-panel">
        <div v-for="user in users" :key="user.username" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
            <div style="margin-bottom: 5px;">
                <strong>{{ user.username }}</strong> 
                <span style="color: gray; font-size: 0.9em;"> (Role: {{ user.role }}) - Flowers: {{ user.flowers.toFixed(5) }}</span>
            </div>
            
            <div style="display: flex; gap: 5px;">
                <input 
                    type="number" 
                    v-model="newScores[user.username]" 
                    placeholder="New Score" 
                    style="width: 100px;"
                >
                <button @click="setScore(user.username)">Set Score</button>
                <button @click="resetUser(user.username)" style="background-color: #ff4c4c; color: white; border: none; border-radius: 3px;">Reset Game</button>
                <button @click="deleteUser(user.username)">Delete</button>
            </div>
        </div>
    </div>
</template>