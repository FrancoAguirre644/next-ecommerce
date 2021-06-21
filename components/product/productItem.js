import Link from 'next/link'
import { useContext } from 'react'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'

const ProductItem = ({ product }) => {

    const { state, dispatch } = useContext(DataContext)
    const { cart, auth } = state

    const userLink = () => {
        return (
            <>
                <Link href={`/product/${product._id}`}>
                    <a className="btn btn-info mr-1 flex-fill">View</a>
                </Link>
                <button className="btn btn-success ml-1 flex-fill" disabled={product.inStock === 0 ? true : false}
                    onClick={() => dispatch(addToCart(product, cart))}>
                    Buy
                </button>
            </>
        )
    }

    const adminLink = () => {
        return (
            <>
                <Link href={`/create/${product._id}`}>
                    <a className="btn btn-info mr-1 flex-fill">Edit</a>
                </Link>
                <button className="btn btn-danger ml-1 flex-fill">
                    Delete
                </button>
            </>
        )
    }

    return (
        <div className="products">
            <div className="card">
                <img className="card-img-top img-fluid" src={product.images[0].url} alt="Card image cap" />
                <div className="card-body">
                    <h5 className="card-title text-capitalize">{product.title}</h5>
                    <div className="row justify-content-between mx-0">
                        <h6>${product.price}</h6>
                        {
                            product.inStock > 0 ?
                                <h6 className="text-success">Stock: {product.inStock}</h6>
                                :
                                <h6 className="text-danger">Stock: Out Stock</h6>
                        }
                    </div>
                    <p className="card-text">{product.description}</p>
                    <div className="row justify-content-between mx-0">
                        {!auth.user || auth.user.role !== 'admin' ? userLink() : adminLink()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductItem