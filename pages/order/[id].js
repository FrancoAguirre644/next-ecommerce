import Head from 'next/head'
import { useState, useContext } from 'react'
import { DataContext } from '../../store/GlobalState'
import { useRouter } from 'next/router'
import Link from 'next/link'
import OrderDatail from '../../components/OrderDetail'

const DetailOrder = () => {

    const { state, dispatch } = useContext(DataContext)
    const { orders, auth } = state

    const router = useRouter()

    const [orderDetail, setOrderDetail] = useState([])

    useState(() => {
        const newArr = orders.filter(order => order._id === router.query.id)
        setOrderDetail(newArr)
    }, [orders])

    return (
        <div>
            <Head>
                <title>Detail Orders</title>
            </Head>

            <div>
                <button className="btn btn-dark" onClick={() => router.back()}>
                    <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i> Go Back
                </button>
            </div>

            <OrderDatail orderDetail={orderDetail}/>

        </div>
    )
}

export default DetailOrder