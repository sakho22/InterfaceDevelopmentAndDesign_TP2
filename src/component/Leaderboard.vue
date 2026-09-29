
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();


const sortedUsers = computed(() => {
    const allUsers = store.state.user.users || [];
    return [...allUsers].sort((a, b) => b.flowers - a.flowers);
});
</script>

<template>
    <div class="leaderboard-panel">
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 2px solid #ccc; text-align: left;">
                    <th style="padding-bottom: 5px;">Rank</th>
                    <th style="padding-bottom: 5px;">Player</th>
                    <th style="padding-bottom: 5px;">Flowers</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in sortedUsers" :key="user.username" style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px 0;"><strong>#{{ index + 1 }}</strong></td>
                    <td>
                        {{ user.username }} 
                        <span v-if="user.role === 'Admin'" style="font-size: 0.8em; color: gray;">(Admin)</span>
                    </td>
                    <td>{{ (user.flowers || 0).toFixed(5) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>