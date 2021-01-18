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
const dispatch = (key, payload) => {
    store.mutations[key](state, payload)
}
const generateReducer = () => {
    const handler = {}
    const keys = Object.getOwnPropertyNames(store.mutations)
    for(let key of keys) {
        handler[key] = store.mutations[key]
    }
    return (state, action) => {
        const { key, payload } = action 
        store.mutations[key](state, payload)
    }
}

const getAction = (key) => store.action[key]
const reducer = generateReducer()

export {
    state,
    dispatch,
    reducer,
    getAction
}