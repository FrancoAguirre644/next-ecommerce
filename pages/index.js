import { useState } from 'react'
import { getData } from '../utils/fetchData'
import ProductItem from '../components/product/productItem'
import Head from 'next/head'

const Home = (props) => {
  const [products, setProducts] = useState(props.productProps)

  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>

      {
        products.length === 0 ?
          <h1>No results</h1>
          :
          <div className="row justify-content-center mt-4">
            {
              products.map(product => (
                <div className="col-md-3" key={product._id}>
                  <ProductItem product={product} />
                </div>
              ))
            }
          </div>
      }

    </div>
  )
}

export async function getServerSideProps() {

  const res = await getData('product')

  return {
    props: {
      productProps: res.products,
      result: res.result
    }, // will be passed to the page component as props
  }
}

export default Home;