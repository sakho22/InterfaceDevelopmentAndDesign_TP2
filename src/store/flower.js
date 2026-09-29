export default {
    state() {
        return {
            store: [
                {
                    id: "upgrade_click",
                    name: "Better Pruners (Click Rate)",
                    type: "clickRate",
                    baseCost: 0.05,
                    effect: 0.00005,
                    maxLvl: Infinity,
                    reqClickRate: 0,
                },
                {
                    id: "hire_worker",
                    name: "Hire Worker",
                    type: "worker",
                    baseCost: 0.1,
                    effect: 1,
                    maxLvl: Infinity,
                    reqClickRate: 0,
                },

                {
                    id: "train_worker",
                    name: "Worker Efficiency (+5%)",
                    type: "efficiency",
                    baseCost: 0.5,
                    effect: 0.05,
                    maxLvl: 5,
                    reqClickRate: 0,
                },

                {
                    id: "hire_manager",
                    name: "Hire Manager (Boosts 1 Group of 7)",
                    type: "manager",
                    baseCost: 5.0,
                    effect: 0.8,
                    maxLvl: Infinity,
                    reqClickRate: 0.003,
                },
            ],
        };
    },
    getters: {
        availableStoreItems(state, getters, rootState) {
            const activeUser = rootState.user.activeUser;
            if (!activeUser) return [];

            return state.store.filter(
                (item) => activeUser.clickRate >= item.reqClickRate,
            );
        },

        getCost: (state, getters, rootState) => (itemId, baseCost) => {
            const activeUser = rootState.user.activeUser;
            const owned = activeUser.upgradesOwned[itemId] || 0;
            return baseCost * Math.pow(1.5, owned);
        },
    },
};
