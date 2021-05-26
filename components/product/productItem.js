import Link from 'next/link'

const ProductItem = ({ product }) => {

    const userLink = () => {
        return (
            <>
                <Link href={`product/${product._id}`}>
                    <a className="btn btn-info mr-1 flex-fill">View</a>
                </Link>
                <button className="btn btn-success ml-1 flex-fill">
                    Buy
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
                        {userLink()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductItem