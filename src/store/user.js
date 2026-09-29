export default {
    state() {
        const savedUsers = JSON.parse(
            localStorage.getItem("cookie_clicker_users"),
        );
        const defaultUsers = [
            {
                username: "root",
                password: "root",
                role: "Admin",
                isActiveUser: false,
                flowers: 0,
                clickRate: 0.0001,
                workers: 0,
                workerEfficiency: 0.15,

                managers: [],
                upgradesOwned: {},
            },
        ];

        return {
            users: savedUsers || defaultUsers,
            activeUser: null,
            autoProductionInterval: null,
        };
    },

    getters: {
        currentProductionRate(state) {
            if (!state.activeUser) return 0;
            const user = state.activeUser;

            const activeManagers = user.managers.filter(
                (m) => m.activeTimeLeft > 0,
            ).length;

            const managedWorkers = Math.min(activeManagers * 7, user.workers);
            const unmanagedWorkers = user.workers - managedWorkers;

            const managedProduction = managedWorkers * user.clickRate * 0.8;
            const unmanagedProduction =
                unmanagedWorkers * user.clickRate * user.workerEfficiency;

            return managedProduction + unmanagedProduction;
        },
    },

    mutations: {
        SET_ACTIVE_USER(state, user) {
            state.users.forEach((u) => (u.isActiveUser = false));

            state.activeUser = user;
            user.isActiveUser = true;

            localStorage.setItem(
                "cookie_clicker_users",
                JSON.stringify(state.users),
            );
        },

        LOGOUT(state) {
            if (state.activeUser) {
                state.activeUser.isActiveUser = false;
            }
            state.activeUser = null;

            localStorage.setItem(
                "cookie_clicker_users",
                JSON.stringify(state.users),
            );
        },

        CREATE_USER(state, payload) {
            state.users.push({
                username: payload.username,
                password: payload.password,
                role: "Player",
                isActiveUser: false,
                flowers: 0,
                clickRate: 0.0001,
                workers: 0,
                workerEfficiency: 0.15,
                managers: [],
                upgradesOwned: {},
            });

            localStorage.setItem(
                "cookie_clicker_users",
                JSON.stringify(state.users),
            );
        },

        ADMIN_DELETE_USER(state, username) {
            if (
                username === "root" ||
                (state.activeUser && state.activeUser.username === username)
            ) {
                alert("You cannot delete this user.");
                return;
            }

            state.users = state.users.filter((u) => u.username !== username);
        },

        SAVE_GAME(state) {
            localStorage.setItem(
                "cookie_clicker_users",
                JSON.stringify(state.users),
            );
        },
        MANUAL_CLICK(state) {
            if (!state.activeUser) return;
            state.activeUser.flowers += state.activeUser.clickRate;

            state.activeUser.flowers = Number(
                state.activeUser.flowers.toFixed(4),
            );
        },

        AUTO_TICK(state, productionRate) {
            const user = state.activeUser;
            if (!user) return;

            if (productionRate > 0) {
                user.flowers += productionRate;
                user.flowers = Number(user.flowers.toFixed(4));
            }

            user.managers.forEach((manager) => {
                if (manager.activeTimeLeft > 0) {
                    manager.activeTimeLeft--;
                    if (manager.activeTimeLeft === 0)
                        manager.cooldownLeft = 180;
                } else if (manager.cooldownLeft > 0) {
                    manager.cooldownLeft--;
                }
            });

            if (user.workers > 0 && Math.random() < 0.01) {
                user.workers--;

                const maxManagersAllowed = Math.floor(user.workers / 7);
                if (user.managers.length > maxManagersAllowed) {
                    user.managers.pop();
                    if (user.upgradesOwned["hire_manager"] > 0)
                        user.upgradesOwned["hire_manager"]--;
                }
            }
        },

        BUY_UPGRADE(state, { upgrade, cost }) {
            const user = state.activeUser;
            if (!user || user.flowers < cost) return;

            user.flowers -= cost;
            user.flowers = Number(user.flowers.toFixed(4));

            if (!user.upgradesOwned[upgrade.id])
                user.upgradesOwned[upgrade.id] = 0;
            user.upgradesOwned[upgrade.id]++;

            switch (upgrade.type) {
                case "clickRate":
                    user.clickRate = Number(
                        (user.clickRate + upgrade.effect).toFixed(4),
                    );
                    break;
                case "worker":
                    user.workers += upgrade.effect;
                    break;
                case "efficiency":
                    user.workerEfficiency = Number(
                        (user.workerEfficiency + upgrade.effect).toFixed(2),
                    );
                    break;
                case "manager":
                    user.managers.push({ activeTimeLeft: 0, cooldownLeft: 0 });
                    break;
            }
        },

        SET_INTERVAL_ID(state, id) {
            state.autoProductionInterval = id;
        },

        ACTIVATE_MANAGER(state, managerIndex) {
            const user = state.activeUser;
            const manager = user.managers[managerIndex];

            if (
                manager &&
                manager.activeTimeLeft === 0 &&
                manager.cooldownLeft === 0
            ) {
                manager.activeTimeLeft = 30;
            }
        },

        ADMIN_SET_SCORE(state, { username, newScore }) {
            const user = state.users.find((u) => u.username === username);
            if (user) {
                user.flowers = Number(newScore);
            }
        },

        ADMIN_RESET_USER(state, username) {
            const user = state.users.find((u) => u.username === username);
            if (user) {
                user.flowers = 0;
                user.clickRate = 0.001;
                user.workers = 0;
                user.workerEfficiency = 0.15;
                user.managers = [];
                user.upgradesOwned = {};
            }
        },
    },

    actions: {
        login(context, payload) {
            const user = context.state.users.find((u) => {
                return u.username === payload.username;
            });

            if (user && user.password === payload.password) {
                context.commit("SET_ACTIVE_USER", user);
                return true;
            }

            return false;
        },

        register({ state, commit }, payload) {
            if (
                state.users.find((user) => {
                    return user.username === payload.username;
                })
            ) {
                console.log("false");
                return false;
            }
            console.log("truetruetrue");
            commit("CREATE_USER", payload);
            return true;
        },
        startAutoProduction({ state, commit, getters }) {
            if (state.autoProductionInterval)
                clearInterval(state.autoProductionInterval);

            const intervalId = setInterval(() => {
                const rate = getters.currentProductionRate;
                if (rate > 0) {
                    commit("AUTO_TICK", rate);
                    commit("SAVE_GAME");
                }
            }, 1000);

            commit("SET_INTERVAL_ID", intervalId);
        },

        stopAutoProduction({ state }) {
            if (state.autoProductionInterval) {
                clearInterval(state.autoProductionInterval);
            }
        },
    },
};
