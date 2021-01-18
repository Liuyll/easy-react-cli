import { store } from './store'

if(typeof window !== 'undefined' && window.__INITIAL_STATE) {
    store.state = window.__INITIAL_STATE
}

const getState = () => store.state
const cloneState = () => JSON.parse(JSON.stringify(getState()))
const serverDispatch = (state, key, payload) => {
    const data = store.mutations[key](getState(), payload)
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
    getState,
    cloneState,
    reducer,
    getAction,
    serverDispatch
}