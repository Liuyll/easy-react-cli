import { store } from './store'

if(typeof window !== 'undefined' && window.__INITIAL_STATE__) {
    store.state = window.__INITIAL_STATE__
}

const state = store.state
const cloneState = () => JSON.parse(JSON.stringify(state))
const getInitState = () => cloneState()

const serverDispatch = (state, key, payload) => {
    const data = store.mutations[key](state, payload)
    Object.assign(state, data)
}

const generateReducer = () => {
    const handler = {}
    const keys = Object.getOwnPropertyNames(store.mutations)
    for(let key of keys) {
        handler[key] = store.mutations[key]
    }
    return (state, action) => {
        const { key, payload } = action 
        return store.mutations[key](state, payload)
    }
}

const getAction = (key) => store.actions[key]
const reducer = generateReducer()

export {
    cloneState,
    getInitState,
    reducer,
    getAction,
    serverDispatch,
}