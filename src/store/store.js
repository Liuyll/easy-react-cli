const store = {
    state: {
        goods: []
    },
    mutations: {
        setGoods(state, goods) {
            // state.goods = goods
            return {
                goods
            }
        },
        addGoods(state, goods) {
            state.goods.push(...goods)
            return {
                goods: state.goods
            }
        }
    },
    actions: {
        async asyncGetGoods({ commit }) {
            await new Promise((r) => setTimeout(r, 2000))
            commit('addGoods', [
                {
                    name: 'new shop'
                },
            ])
        }
    }
}

export {
    store
}