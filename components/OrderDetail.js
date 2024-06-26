import Link from 'next/link'
import { updateItem } from '../store/Actions'
import { patchData } from '../utils/fetchData'
import PaypalBtn from './PaypalBtn'

const OrderDetail = ({ orderDetail, state, dispatch }) => {

    const { auth, orders } = state

    const handleDelivered = (order) => {
        dispatch({ type: 'NOTIFY', payload: { loading: true } })

        patchData(`order/delivered/${order._id}`, null, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

                const { paid, dateOfPayment, method, delivered } = res.result

                dispatch(updateItem(orders, order._id, {
                    ...order, paid, dateOfPayment, method, delivered
                }, 'ADD_ORDERS'))

                return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })

            })

    }

    return (
        <>
            {
                orderDetail.map(order => (
                    <div style={{ margin: '20px auto' }} key={order._id} className="row justify-content-around">

                        <div key={order._id} style={{ maxWidth: '600px' }} className="text-uppercase my-3">
                            <h2 className="text-break">Order {order._id}</h2>
                            <div className="mt-4 text-secondary">
                                <h4>Shipping</h4>

                                <p>Name: {order.user.name}</p>
                                <p>Email: {order.user.email}</p>
                                <p>Adress: {order.adress}</p>
                                <p>Mobile: {order.mobile}</p>

                                <div className={`alert ${order.delivered ? 'alert-success' : 'alert-danger'}
                                d-flex justify-content-between align-items-center`}>
                                    {
                                        order.delivered ? `Delivered on ${new Date(order.updatedAt).toLocaleString('es-ES')}` : 'Not Delivered'
                                    }
                                    {
                                        auth.user.role === 'admin' && !order.delivered &&
                                        <button className="btn btn-dark text-uppercase" onClick={() => handleDelivered(order)}>
                                            Mark as delivered
                                        </button>
                                    }
                                </div>

                                <h3>Payment</h3>
                                {
                                    order.method && <h6>Method: <em>{order.method}</em> </h6>
                                }
                                {
                                    order.paymentId &&  <p>PaymentId: <em>{order.paymentId}</em> </p>
                                }

                                <div className={`alert ${order.paid ? 'alert-success' : 'alert-danger'}
                                d-flex justify-content-between align-items-center`}>
                                    {
                                        order.paid ? `Paid on ${new Date(order.dateOfPayment).toLocaleString('es-ES')}` : 'Not Paid'
                                    }

                                </div>

                                <h3>Order Items</h3>
                                <div>
                                    {
                                        order.cart.map(item => (
                                            <div className="row border-bottom m-0 p-2 justify-content-between align-items-center"
                                                style={{ maxWidth: '550px' }} key={item._id}>
                                                <img src={item.images[0].url} alt={item.images[0].url}
                                                    className="img-thumbnail"
                                                    style={{ width: '50px', height: '45px' }}
                                                />

                                                <h5 className="flex-fill text-secondary px-3 text-capitalize m-0">
                                                    <Link href={`/product/${item._id}`}>
                                                        <a className="text-secondary">{item.title}</a>
                                                    </Link>
                                                </h5>

                                                <span className="text-info m-0">
                                                    {item.quantity} x ${item.price} = ${item.price * item.quantity}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>

                            </div>
                        </div>

                        {
                            !order.paid && auth.user.role !== 'admin' &&
                            <div className="p-4">
                                <h2 className="mb-4 text-uppercase">Total: ${order.total}</h2>
                                <PaypalBtn order={order} />
                            </div>
                        }

                    </div>
                ))
            }
        </>
    )
}

export default OrderDetail