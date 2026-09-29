
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const activeUser = computed(() => store.state.user.activeUser);
const availableItems = computed(() => store.getters.availableStoreItems);


const getCost = (item) => {
    return store.getters.getCost(item.id, item.baseCost);
};


const getOwned = (itemId) => {
    if (!activeUser.value) return 0;
    return activeUser.value.upgradesOwned[itemId] || 0;
};


const buyUpgrade = (item) => {
    const cost = getCost(item);
    if (activeUser.value && activeUser.value.flowers >= cost) {
        store.commit('BUY_UPGRADE', { upgrade: item, cost: cost });
        store.commit('SAVE_GAME');
    }
};
</script>

<template>
    <div class="store">
        <h2>Upgrade Store</h2>
        
        <div v-if="availableItems.length === 0">
            <p>No upgrades available yet. Keep clicking!</p>
        </div>

        <div v-for="item in availableItems" :key="item.id" style="border: 1px solid #ccc; margin-bottom: 10px; padding: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>{{ item.name }}</strong>
                    <br>
                    <span>Cost: {{ getCost(item).toFixed(5) }} flowers</span>
                    <br>
                    <span>
                        Level: {{ getOwned(item.id) }} 
                        <span v-if="item.maxLvl !== Infinity">/ {{ item.maxLvl }}</span>
                    </span>
                </div>
                
                <button 
    @click="buyUpgrade(item)"
    :disabled="
        getOwned(item.id) >= item.maxLvl || 
        (activeUser && activeUser.flowers < getCost(item)) ||
        (item.type === 'manager' && getOwned(item.id) >= Math.floor(activeUser.workers / 7))
    "
>
    
    <template v-if="getOwned(item.id) >= item.maxLvl">MAX LEVEL</template>
    <template v-else-if="item.type === 'manager' && getOwned(item.id) >= Math.floor(activeUser?.workers / 7)">NEED MORE WORKERS</template>
    <template v-else>Buy</template>
</button>
            </div>
        </div>
    </div>
</template>