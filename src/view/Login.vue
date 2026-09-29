<script setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const loginData = { username: "", password: "" };
const router = useRouter();

const login = async () => {
    const success = await store.dispatch("login", {
        username: loginData.username, 
        password: loginData.password
    }); 
    
    if (success) {
        router.push({name: "Home"});
    } else {
        alert("Invalid username or password");
    }
};
</script>

<template>
    <div class="container">
        <div class="form-wrapper">
            <h2>Login</h2>
            
            <div class="input-group">
                <label for="username">Username</label>
                <input type="text" id="username" v-model.trim="loginData.username">
            </div>

            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" v-model="loginData.password">
            </div>

            <div class="button-group">
                <button @click="login">Login</button>
                <button @click="router.push({name: 'Register'})">Register</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.form-wrapper {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 250px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
}

input, button {
    padding: 8px;
    font-size: 1rem;
}
</style>