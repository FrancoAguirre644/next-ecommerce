import { DataContext } from '../store/GlobalState'
import { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import CartItem from '../components/CartItem'
import Link from 'next/link'
import { getData } from '../utils/fetchData'
import PaypalBtn from './paypalBtn'

const Cart = () => {

    const { state, dispatch } = useContext(DataContext)
    const { cart, auth } = state

    const [total, setTotal] = useState(0)

    const [adress, setAdress] = useState('')
    const [mobile, setMobile] = useState('')
    const [payment, setPayment] = useState(false)

    useEffect(() => {
        const getTotal = () => {
            const res = cart.reduce((prev, item) => {
                return prev + (item.price * item.quantity)
            }, 0)

            setTotal(res)
        }

        getTotal()

    }, [cart])

    useEffect(() => {
        const cartLocal = JSON.parse(localStorage.getItem('__next__cart01'));

        if (cartLocal.length > 0 && cartLocal) {
            let newArr = []

            const updateCart = async () => {
                for (const item of cartLocal) {
                    const res = await getData(`product/${item._id}`)
                    const { _id, title, images, price, inStock, sold } = res.product
                    if (inStock > 0) {
                        newArr.push({
                            _id, title, images, price, inStock, sold,
                            quantity: item.quantity > inStock - sold ? 1 : item.quantity
                        })
                    }
                }

                dispatch({ type: 'ADD_CART', payload: newArr })
            }

            updateCart()

        }

    }, [])

    const handlePayment = () => {
        if (!mobile || !adress)
            return dispatch({ type: 'NOTIFY', payload: { error: 'Please add your address and mobile' } })
        setPayment(true)
    }

    if (cart.length === 0) {
        return (
            <img className="img-responsive w-100" src="/empty_cart.jpg" alt="empty_cart" />
        )
    }

    return (
        <div className="row mx-auto">
            <Head>
                <title>Cart</title>
            </Head>

            <div className="col-md-8 text-secondary table-responsive my-3">
                <h2 className="text-uppercase">Shopping Cart</h2>

                <table className="table my-3">
                    <tbody>
                        {
                            cart.map((item) => (
                                <CartItem key={item._id} item={item} dispatch={dispatch} cart={cart} />
                            ))
                        }
                    </tbody>
                </table>

            </div>

            <div className="col-md-4 text-secondary text-right table-responsive my-3">
                <form>
                    <h2 className="text-uppercase">Shipping</h2>
                    <label>Adress</label>
                    <input className="form-control mb-2" name="address" id="address" value={adress} onChange={e => setAdress(e.target.value)} />

                    <label>Mobile</label>
                    <input className="form-control mb-2" name="mobile" id="mobile" value={mobile} onChange={e => setMobile(e.target.value)} />
                </form>

                <h3>Total: <span className="text-info">${total}</span></h3>

                {
                    payment
                        ? <PaypalBtn total={total}
                            adress={adress}
                            mobile={mobile}
                            state={state}
                            dispatch={dispatch}
                            />
                        : <Link href={auth.user ? "#" : "/signin"}>
                            <a className="btn btn-dark my-2" onClick={handlePayment}>Proceed with payment</a>
                        </Link>
                }


            </div>

        </div>
    )
}

export default Cart;