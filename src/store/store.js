const store = {
    state: {
        goods: []
    },
    mutations: {
        setGoods(state, goods) {
            state.goods = goods
        }
    },
    actions: {

    }
}

if(typeof window !== 'undefined' && window.__INITIAL_STATE) {
    store.state = window.__INITIAL_STATE
}

const state = store.state
const dispatch = (mutation, payload) => {
    store.mutations[mutation](state, payload)
}

export {
    state,
    dispatch
}