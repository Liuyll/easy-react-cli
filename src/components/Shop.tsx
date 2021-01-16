import * as React from 'react'
import { useContext } from 'react'
import axios from 'axios'
import { Context } from '../store/context'

function Shop(){
    const { store } = useContext(Context)
    return (
        <div className="wrap">
            {
                store.goods.map((good,index) => (
                    <div key={index}>{good.name}</div>
                ))
            }
        </div>
    )
}

Shop.getInitialData = async (dispatch) => {
    const res = await axios('http://localhost:8080/api/goods')
    dispatch('setGoods', res.data)
}

export default Shop