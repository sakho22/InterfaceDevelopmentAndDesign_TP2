<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const activeUser = computed(() => store.state.user.activeUser);

if (!activeUser.value) {
    router.push({name: 'Login'});
}

const logout = () => {
    store.commit('LOGOUT');
    router.push({name: 'Login'});
};
</script>

<template>
    <div class="app-wrapper">
        <main class="main-content">
            <RouterView></RouterView>
        </main>
        
        <footer v-if="activeUser" class="app-footer">
            <span class="username">@{{ activeUser.username }}</span>
            <button class="logout-btn" @click="logout">Logout</button>
        </footer>
    </div>
</template>

<style>
html, body, #app {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden; 
    background-color: white;
}
</style>

<style scoped>
.app-wrapper {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.main-content {
    flex-grow: 1; 
    position: relative;
    overflow: hidden; 
}

.app-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    height: 50px;
    box-sizing: border-box;
}

.logout-btn {
    border: none;
    background-color: white;
    padding: 8px 16px;
    cursor: pointer;
    font-weight: bold;
}

.logout-btn:hover {
    text-decoration: underline;
}
</style>