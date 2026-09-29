<script setup>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();
const newUserData = { username: "", password: "" };

const register = async () => {
    const success = await store.dispatch("register", newUserData); 
    
    if (success) {
        router.push({name: "Login"});
    } else {
        alert("Registration failed.");
    }
};
</script>

<template>
    <div class="container">
        <div class="form-wrapper">
            <h2>Register</h2>
            
            <div class="input-group">
                <label for="username">Username</label>
                <input type="text" id="username" v-model.trim="newUserData.username">
            </div>

            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" v-model="newUserData.password">
            </div>

            <div class="button-group">
                <button @click="register">Create Account</button>
                <button @click="router.push({name: 'Login'})">Back to Login</button>
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