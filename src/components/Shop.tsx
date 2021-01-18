import * as React from 'react'
import { useContext } from 'react'
import axios from 'axios'
import { Context } from '../store/context'

function Shop(){
    const { store, dispatch } = useContext(Context)
    return (
        <div className="wrap">
            <p>shops:</p>
            {
                store.goods.map((good,index) => (
                    <div key={index}>{good.name}</div>
                ))
            }
            <button onClick={() => dispatch('asyncGetGoods')}>add one</button>
        </div>
    )
}

Shop.getInitialData = async (state, dispatch) => {
    const res = await axios('http://localhost:8080/api/goods')
    dispatch(state, 'setGoods', res.data)
}

export default Shop