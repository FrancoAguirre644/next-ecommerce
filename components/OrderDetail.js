import Link from 'next/link'
import PaypalBtn from './PaypalBtn'

const OrderDetail = ({ orderDetail }) => {
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
                                        order.delivered ? `Delivered on ${order.updatedAt}` : 'Not Delivered'
                                    }

                                </div>

                                <h3>Payment</h3>
                                <div className={`alert ${order.paid ? 'alert-success' : 'alert-danger'}
                                d-flex justify-content-between align-items-center`}>
                                    {
                                        order.paid ? `Paid on ${order.dateOfPayment}` : 'Not Paid'
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
                                                    <Link href={`product/${item._id}`}>
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
                            !order.paid &&
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